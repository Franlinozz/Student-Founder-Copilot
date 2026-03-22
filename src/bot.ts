import "dotenv/config";
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { Telegraf, Context, Markup } from "telegraf";
import { prisma } from "./lib/prisma";
import { buildSubmissionPack } from "./lib/packBuilder";
import { anchorHashOnBase } from "./lib/anchor";

const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];

if (!BOT_TOKEN) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN");
}

type BotContext = Context;

const bot = new Telegraf(BOT_TOKEN);

type VerificationField =
  | "fullName"
  | "schoolName"
  | "schoolEmail"
  | "graduationYear"
  | "program"
  | "yearsLeft"
  | "idImageUrl"
  | "ideaSummary";

const VERIFICATION_STEPS: { field: VerificationField; prompt: string; optional?: boolean }[] = [
  { field: "fullName", prompt: "What's your full legal name?" },
  { field: "schoolName", prompt: "Which school do you attend?" },
  { field: "schoolEmail", prompt: "Active school email? (e.g. name@school.edu)" },
  { field: "graduationYear", prompt: "Expected graduation year (YYYY)." },
  { field: "program", prompt: "Program / major (optional).", optional: true },
  { field: "yearsLeft", prompt: "Years/semesters left (optional).", optional: true },
  { field: "idImageUrl", prompt: "Link to a clear photo of your student ID (ID # can be redacted)." },
  { field: "ideaSummary", prompt: "Describe your current idea in 1–2 lines (optional).", optional: true }
];

type VerificationSession = {
  stepIndex: number;
  data: Record<string, string>;
};

const verificationSessions = new Map<number, VerificationSession>();
const ideaSessions = new Set<number>();

bot.start(async (ctx) => {
  await ctx.reply(
    "👋 Welcome to Student Founder Copilot — verify once, discover opportunities, auto-generate submission packs, and anchor proof on Base.",
    Markup.keyboard([
      ["✅ Verify me", "🧭 Find opportunities"],
      ["🧠 Polish my idea", "⛓️ Anchor proof"]
    ]).resize()
  );
});

bot.hears("✅ Verify me", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  verificationSessions.set(userId, { stepIndex: 0, data: {} });
  await ctx.reply("I’ll gather the required College.xyz proof. Type 'cancel' anytime to stop.");
  const firstPrompt = VERIFICATION_STEPS[0]?.prompt ?? "What’s your full legal name?";
  await ctx.reply(firstPrompt);
});

bot.hears("🧭 Find opportunities", async (ctx) => {
  await ctx.reply(
    "What type of opportunity do you want?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Hackathons", "opp:hackathon"), Markup.button.callback("Bounties", "opp:bounty")],
      [Markup.button.callback("Internships", "opp:internship"), Markup.button.callback("All", "opp:all")]
    ])
  );
});

bot.action(/opp:(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const filter = ctx.match?.[1] ?? "all";
  const opportunities = await loadOpportunities();
  const list = opportunities
    .filter((item) => (filter === "all" ? true : item.category === filter))
    .slice(0, 3)
    .map((item) => `• *${item.title}* (${item.category})\nHost: ${item.hostedBy}\nLink: ${item.url}`)
    .join("\n\n");
  await ctx.replyWithMarkdown(list || "No matches yet — I’ll refresh the feed shortly.");
});

bot.hears("🧠 Polish my idea", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  ideaSessions.add(userId);
  await ctx.reply("Drop your rough idea (or type 'cancel'). I’ll turn it into a submission-ready brief.");
});

bot.hears("⛓️ Anchor proof", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  if (!telegramId) return;
  const latest = await getLatestVerification(telegramId);
  if (!latest?.proofHash) {
    await ctx.reply("I need a verification hash before anchoring. Use '✅ Verify me' first.");
    return;
  }
  try {
    const normalized = latest.proofHash.startsWith("0x") ? latest.proofHash : `0x${latest.proofHash}`;
    const txHash = await anchorHashOnBase(normalized);
    await prisma.studentVerification.update({ where: { id: latest.id }, data: { onchainTx: txHash } });
    await ctx.reply(`Anchored ✅\nTx: https://basescan.org/tx/${txHash}`);
  } catch (error) {
    console.error("anchor failed", error);
    await ctx.reply(
      "I couldn’t push to Base automatically (missing RPC/key). Run `npm run anchor -- <hash>` locally with a funded Base wallet, then paste the tx link here so I can store it."
    );
  }
});

bot.on("text", async (ctx, next) => {
  if (await handleVerificationResponse(ctx)) return;
  if (await handleIdeaResponse(ctx)) return;
  return next();
});

bot.catch((err, ctx) => {
  console.error("Bot error", err);
  ctx.reply("Something went wrong. Try again shortly.").catch(() => undefined);
});

bot.launch().then(() => console.log("Bot launched"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

async function handleVerificationResponse(ctx: BotContext) {
  const userId = ctx.from?.id;
  if (!userId) return false;
  const session = verificationSessions.get(userId);
  if (!session) return false;

  const message = getText(ctx);
  if (!message) return true;

  if (message.toLowerCase() === "cancel") {
    verificationSessions.delete(userId);
    await ctx.reply("Verification canceled. Use '✅ Verify me' to restart.");
    return true;
  }

  const step = VERIFICATION_STEPS[session.stepIndex];
  if (!step) {
    verificationSessions.delete(userId);
    return true;
  }

  if (step.optional && message.toLowerCase() === "skip") {
    session.data[step.field] = "";
  } else {
    session.data[step.field] = message;
  }

  session.stepIndex += 1;

  if (session.stepIndex < VERIFICATION_STEPS.length) {
    const nextStep = VERIFICATION_STEPS[session.stepIndex];
    await ctx.reply(nextStep?.prompt ?? "Next question...");
    return true;
  }

  verificationSessions.delete(userId);
  const payload = {
    telegramId: userId.toString(),
    telegramHandle: ctx.from?.username ?? null,
    fullName: session.data.fullName ?? "",
    schoolName: session.data.schoolName ?? "",
    schoolEmail: session.data.schoolEmail ?? "",
    graduationYear: Number(session.data.graduationYear) || new Date().getFullYear(),
    program: session.data.program || null,
    yearsLeft: session.data.yearsLeft ? Number(session.data.yearsLeft) : null,
    idImageUrl: session.data.idImageUrl ?? "",
    ideaSummary: session.data.ideaSummary || null,
  };

  const canonical = Object.keys(payload)
    .sort()
    .map((key) => `${key}:${payload[key as keyof typeof payload] ?? ""}`)
    .join("|");
  const proofHash = createHash("sha256").update(canonical).digest("hex");

  try {
    await prisma.studentVerification.create({
      data: {
        ...payload,
        consentGranted: true,
        proofHash,
      },
    });
  } catch (error) {
    console.error("verification save failed", error);
    await ctx.reply("I couldn’t save your verification. Please try again in a minute.");
    return true;
  }

  await ctx.reply("✅ Verification captured. Proof hash:");
  await ctx.reply(proofHash);
  await ctx.reply("Use '⛓️ Anchor proof' when you’re ready to push this hash to Base.");

  return true;
}

async function handleIdeaResponse(ctx: BotContext) {
  const userId = ctx.from?.id;
  if (!userId) return false;
  if (!ideaSessions.has(userId)) return false;

  const message = getText(ctx);
  if (!message) return true;

  if (message.toLowerCase() === "cancel") {
    ideaSessions.delete(userId);
    await ctx.reply("Idea polishing canceled. Tap '🧠' whenever you’re ready again.");
    return true;
  }

  ideaSessions.delete(userId);
  const pack = buildSubmissionPack({ idea: message });
  const telegramId = userId.toString();
  const student = await getLatestVerification(telegramId);

  if (student) {
    try {
      await prisma.submissionPack.create({
        data: {
          studentId: student.id,
          roughIdea: message,
          refinedMarkdown: pack.markdown,
          summaryHash: pack.summaryHash,
        },
      });
    } catch (error) {
      console.error("idea pack save failed", error);
    }
  }

  await ctx.replyWithMarkdown(pack.markdown, { disable_notification: true });
  await ctx.reply(`Summary hash: ${pack.summaryHash}`);
  if (!student) {
    await ctx.reply("Tip: verify first so I can tie packs + hashes to your on-chain proof.");
  }

  return true;
}

async function loadOpportunities() {
  const filePath = join(process.cwd(), "data", "opportunities.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as {
    title: string;
    category: string;
    hostedBy: string;
    deadline: string | null;
    tags: string[];
    url: string;
  }[];
}

async function getLatestVerification(telegramId: string) {
  return prisma.studentVerification.findFirst({
    where: { telegramId },
    orderBy: { createdAt: "desc" },
  });
}

function getText(ctx: BotContext) {
  const msg = ctx.message;
  if (!msg) return undefined;
  if ("text" in msg) {
    return msg.text.trim();
  }
  return undefined;
}
