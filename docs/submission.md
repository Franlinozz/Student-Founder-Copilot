# Submission Package — Student Founder Copilot

## TL;DR
- **Track:** College.xyz student-only bounty inside The Synthesis
- **Problem:** Students need a fast lane to verify enrollment, find opportunities, and convert rough ideas into real submissions.
- **Solution:** Telegram bot that verifies student identity, curates opportunities, generates submission packs, and anchors proof-of-work on Base.
- **On-chain proof:** Hash `32e04e20e0a7a3178e9c35eb8f4450b94057fc4141b7dbd37c4865dd75a3470a` → Base tx [`0xbda3987…539c0`](https://basescan.org/tx/0xbda398790e3e6fa3ec17fef19d3f2b86687d3cb4538dce05c6391605082539c0).

## Demo Checklist
1. **Verification flow** — run `/start` → tap "✅ Verify me" → walk through prompts (use throwaway data for demo). Show proof hash in chat.
2. **Opportunity scout** — tap "🧭 Find opportunities", choose a filter, show curated results.
3. **Idea pack** — tap "🧠 Polish my idea", paste a raw idea, show Markdown response + summary hash.
4. **Anchor proof** — run `npm run anchor -- <hash>` (already done for Nonso) or tap "⛓️ Anchor proof" after adding env keys to trigger automatic broadcast.

## How to Run Locally
```bash
npm install
cp .env.example .env # fill TELEGRAM_BOT_TOKEN, BASE_PRIVATE_KEY, BASE_RPC_URL
docker run -it --rm -v "$PWD":/app -w /app node:22 bash # optional container
npm run prisma:migrate
npm run dev
```
Attach the bot to Telegram (BotFather) and test from your account.

## Submission Form Snippets
- **Project description (short):**
  > Student Founder Copilot is a Telegram-native agent for College.xyz students. It verifies enrollment, surfaces relevant hackathons/internships, turns ideas into submission-ready briefs, and anchors proof-of-work on Base.

- **What makes it special:**
  > Single chat flow replaces dashboards: verification, opportunity scouting, idea polishing, and Base anchoring all happen in Telegram. Built for actual students (UNILAG example anchored), with scripts to reproduce hashing + on-chain proof.

- **Conversation log (bullet excerpt):**
  1. Identity + registration (apiKey issued, boundaries set).
  2. Track choice (College.xyz) + requirement gathering.
  3. Build plan → scaffolding → verification + hashing → opportunity feed → idea pack.
  4. Wallet funding + Base hash anchoring (tx link above).
  5. README/submission assets prepared for final handoff.

## Outstanding Before Final Submit
- Capture at least two screenshots (verification flow, idea pack output) and optionally a 30s Loom.
- When College.xyz requests proof, send: name, school, grad year, school email, ID photo (already collected) via their verification link/email.

## Repos/Files to Share
- `README.md` — overview + instructions + on-chain proof
- `.env.example` — required environment vars
- `docs/student-founder-copilot.md` — full spec
- `docs/submission.md` (this file)
- `data/opportunities.json` — curated feed
- `scripts/anchor-hash.ts` + `scripts/generate-pack.ts`

With these assets you can paste straight into the Synthesis submission form and hand the verification proof to the College.xyz jury.
