# Student Founder Copilot (College.xyz Track)

Telegram-native agent that helps verified students:

1. **Prove enrollment** — collects College.xyz-required fields, hashes the payload, and anchors it on Base.
2. **Discover opportunities** — curated feed of hackathons, bounties, and internships filtered in-chat.
3. **Ship submission packs** — converts a rough idea into a structured brief (problem, solution, differentiators, milestones) with a summary hash.

## Tech Stack
- **Harness:** OpenClaw (TypeScript)
- **Bot:** Telegraf
- **Storage:** SQLite via Prisma
- **On-chain:** Base mainnet (`https://mainnet.base.org` RPC) with a dedicated wallet (`0x0A80903FF3aAd79728EEA3BB5d85900f820a078c`)

## Getting Started
1. `cp .env.example .env` and fill in:
   - `TELEGRAM_BOT_TOKEN`
   - `BASE_RPC_URL` (default `https://mainnet.base.org` works)
   - `BASE_PRIVATE_KEY` (funded wallet)
2. `npm install`
3. `npm run prisma:migrate`
4. `npm run dev`

## Key Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Run the Telegram bot with live reloading |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run pack:generate` | Create a submission pack from `idea.txt` |
| `npm run anchor -- <hash>` | Anchor a SHA-256 hash on Base mainnet |

## On-chain Proof
- Verification hash for Okafor Chioma Perpetua (UNILAG, grad 2026) anchored in tx: [`0xbda398790e3e6fa3ec17fef19d3f2b86687d3cb4538dce05c6391605082539c0`](https://basescan.org/tx/0xbda398790e3e6fa3ec17fef19d3f2b86687d3cb4538dce05c6391605082539c0)
- Hash: `32e04e20e0a7a3178e9c35eb8f4450b94057fc4141b7dbd37c4865dd75a3470a`

## Submission Notes
- Track: **College.xyz — Student Founder Agent**
- Problem statement (registration + brief): “I’m building a Student Founder Copilot on College.xyz—a Telegram agent that verifies real students, surfaces relevant hackathons and internships, turns rough ideas into polished submission packs, and anchors their proof-of-work onchain so verified students can ship something real fast.”
- Verification requirements satisfied (name, school, grad year, school email, ID photo link).
- Remaining TODO for submission: capture bot screenshots + short Loom of the flow, paste conversation log excerpt, upload student proof when the organizers request it post-submission.

## Conversation Log Highlight
Document the collaboration by exporting the Telegram chat or summarizing the key checkpoints:
1. Identity + registration setup (apiKey issued).
2. Feature planning + architecture decisions.
3. Verification payload capture + Base hash anchoring.
4. Final QA + submission packaging.

## Demo Assets
Located in `assets/`:
- `verification.jpg` — verification intake + proof hash (sample run).
- `opportunities.jpg` — hackathon feed via “🧭 Find opportunities.”
- `idea-pack.jpg` — idea-to-pack Markdown output + summary hash.

---
Built by **Johnnisco** & **Nonso (Okafor Chioma Perpetua)** for The Synthesis × College.xyz track.
