import { createHash } from "node:crypto";

export type PackInput = {
  idea: string;
  persona?: string;
  trackFocus?: string;
};

export type PackOutput = {
  markdown: string;
  summaryHash: string;
};

export function buildSubmissionPack(input: PackInput): PackOutput {
  const persona = input.persona ?? "Verified student founder";
  const trackFocus = input.trackFocus ?? "College.xyz — Student Founder Agent";
  const sections = {
    problem: `Students struggle to turn raw ideas into submissions fast enough to win college-only bounties. Manual verification, poor opportunity visibility, and slow packaging kill momentum.`,
    solution: `${persona} gets a Telegram copilot that verifies their student status, surfaces curated opportunities, and turns their idea into a submission pack with on-chain proof in minutes.`,
    differentiators: [
      "End-to-end flow in a single Telegram chat (no dashboards).",
      "Built-in student verification that satisfies College.xyz proof requirements.",
      "Base hash anchoring for auditable proof-of-work and eligibility."
    ],
    milestones: [
      "MVP: verification intake + opportunity feed + template pack",
      "Week 2: automated ID OCR + Base hash anchoring",
      "Week 4: campus ambassador program + multi-school feeds"
    ]
  };

  const markdown = `# Submission Pack\n\n## Track\n${trackFocus}\n\n## Idea Snapshot\n${input.idea.trim()}\n\n## Problem\n${sections.problem}\n\n## Solution\n${sections.solution}\n\n## Why it stands out\n${sections.differentiators.map((d) => `- ${d}`).join("\n")}\n\n## Milestones\n${sections.milestones.map((m) => `1. ${m}`).join("\n")}`;

  const summaryHash = createHash("sha256").update(markdown).digest("hex");

  return { markdown, summaryHash };
}
