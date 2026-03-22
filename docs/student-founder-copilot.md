# Student Founder Copilot — Build Brief

## 1. Problem & Goal
- **Track:** College.xyz (student-only track inside The Synthesis)
- **Problem:** Verified students struggle to discover real opportunities, frame their ideas, and prove output in a credible, on-chain way.
- **Goal:** Ship a Telegram-based agent that verifies a student, surfaces opportunities, turns a rough idea into a submission pack, and anchors proof-of-work on Base with a simple hash — all within the hackathon window.

## 2. MVP Scope (must-hit)
1. **Student verification intake**
   - Collect: full name, school, graduation year, school email, Telegram handle, selfie/ID photo URL placeholder.
   - Store metadata + signed consent locally (JSON/SQLite).
   - Create deterministic hash (e.g., SHA-256 of verification payload) that we can later push on-chain.
2. **Opportunity scout**
   - Curated JSON of current hackathons/bounties/internships (Devpost, Buildspace, Dora, AngelList). Keep data local to avoid heavy API calls.
   - Filter by tags (hackathon, bounty, internship) + region or remote.
3. **Idea → submission pack**
   - Prompt templates (system + user) that turn a freeform idea into: problem, solution, user story, architecture, timeline, differentiators.
   - Output as Markdown + shareable summary for submission.
4. **On-chain proof**
   - Take the verification hash + summary hash, store on Base (mainnet preferred; fallback Sepolia) via a minimal contract call or simple `data` tx using a funded wallet.
   - Provide transaction URL back to the student.
5. **Conversation logging**
   - Persist key exchanges locally so we can paste into `conversationLog` during submission.

## 3. User Flow (Telegram Bot)
1. `/start` → explain bot + terms (student-only, data used for verification + hash).
2. `Verify me` → step-through form collecting required fields, request ID photo link (for demo, allow URL upload or placeholder text). After final confirmation, compute + return hash preview.
3. `Find opportunities` → ask for interest (hackathon/internship/bounty), location preference, output top 3 matches from curated dataset.
4. `Polish idea` → ask for rough idea text + optional tags, run prompt, return formatted submission pack + download link.
5. `Anchor proof` → optional command that takes stored hash and submits on-chain, returning Base transaction link.

## 4. Architecture & Stack
- **Language:** TypeScript/Node.js
- **Bot framework:** Telegraf (lightweight, supports keyboards, works well on Vercel/Node).
- **Persistence:** SQLite (via Prisma) for speed + portability.
- **Hashing:** Node crypto `createHash('sha256')` over sorted JSON payload.
- **On-chain:** ethers.js + Base RPC (via public endpoint or Alchemy). Wallet stored in `.env` (generate now, fund from Base). Simple transaction sending hash in calldata to a no-op contract or our own minimal contract (if time).
- **Opportunity data:** `data/opportunities.json` with 15–20 curated entries. Provide script to refresh later.

## 5. Milestones & Owners
| Time | Milestone | Notes |
| --- | --- | --- |
| T+0.5h | Spec + repo scaffolding | Current step. |
| T+1.5h | Basic bot commands + SQLite schema | `/start`, `/verify`, `/opportunities`, `/pack`. |
| T+3h | Verification hashing + submission pack prompt working | Ensure CLI script to test prompts offline to save API calls. |
| T+4h | On-chain hash + opportunity feed polished | Gas test on Base. |
| T+4.5h | Demo capture + README + submission draft | Include screenshots + conversation log excerpt. |

## 6. Submission Assets Checklist
- GitHub repo (MIT, instructions to run).
- README with: problem, features, architecture, how-to-run, Base tx link.
- Conversation log snippet.
- Screenshots / Loom of Telegram bot.
- Verification proof (hash + explanation) + mention of compliance with College.xyz rules.

## 7. Open Questions
1. Bot hosting: local vs simple cloud VM? (Start local for demo; mention hosting plan in README.)
2. Student ID uploads: for demo we can accept image URLs; highlight future plan for encrypted storage + auto-redaction.
3. On-chain wallet custody: generate ephemeral wallet now; share private key securely with Nonso post-hackathon if needed.

---
_Action items next: scaffold repo + data directories, define Prisma schema, draft Telegraf command stubs, seed opportunities JSON, prep prompt templates._
