# College.xyz Compliance Checklist

| Requirement | Status | Proof / Notes |
| --- | --- | --- |
| Current student only | ✅ | User data captured (UNILAG, grad 2026). Stored fields: name, school, school email, grad year, ID photo link. |
| Student verification after submission | ✅ | Hash anchored on Base mainnet (tx `0xbda3987…539c0`). README explains how to supply real proofs when judges request them. |
| AI agent + web3 focus | ✅ | Telegram agent orchestrates verification, opportunity curation, idea packaging, Base anchoring. |
| Working demo (ship something real) | ✅ | Bot scripts, data, and CLI tools included; demo script shows live flow. |
| Open source | ✅ | Entire workspace acts as repo; README + scripts ready to publish on GitHub. |
| Documented collaboration | ✅ | Conversation summary + bullet log in `docs/submission.md`; hashed proof logs stored locally. |
| Conversation log for submission form | ✅ | Section in `docs/submission.md` with bullet points. |
| On-chain artifact | ✅ | Base tx link + hash recorded in README/submission docs. |
| README / run instructions | ✅ | `README.md` with setup, scripts, proof links. |
| Opportunity for future students | ✅ | Bot stores verification + packs, plus CLI to anchor new hashes with `npm run anchor`. |

**Next steps before hitting “Submit”:**
1. Capture screenshots/Loom following `docs/demo-script.md`.
2. Push this repo to GitHub (public) or zip it and upload in the Synthesis form.
3. Paste the submission snippets from `docs/submission.md`.
4. When College.xyz requests verification, respond with the stored info (name, school, grad year, school email, ID photo link) — the hash is already on Base for extra proof.
