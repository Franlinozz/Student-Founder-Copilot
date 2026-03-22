import "dotenv/config";
import { anchorHashOnBase } from "../src/lib/anchor";

async function run() {
  const hash = process.argv[2];
  if (!hash) {
    console.error("Usage: npm run anchor -- <hex-hash>");
    process.exit(1);
  }
  const tx = await anchorHashOnBase(hash);
  console.log("Anchored hash in tx:", tx);
}

run().catch((err) => {
  console.error("Failed to anchor hash", err);
  process.exit(1);
});
