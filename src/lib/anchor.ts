import { JsonRpcProvider, Wallet, hexlify } from "ethers";

const RPC_URL = process.env["BASE_RPC_URL"];
const PRIVATE_KEY = process.env["BASE_PRIVATE_KEY"];

export async function anchorHashOnBase(hexHash: string) {
  if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error("Missing BASE_RPC_URL or BASE_PRIVATE_KEY environment variables.");
  }

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);

  const data = normalizeHash(hexHash);
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: 0n,
    data,
  });

  return tx.hash;
}

const HASH_REGEX = /^0x[0-9a-fA-F]+$/;

function normalizeHash(hash: string) {
  if (HASH_REGEX.test(hash)) {
    return hash.length % 2 === 0 ? hash : `0x0${hash.slice(2)}`;
  }
  const stripped = hash.replace(/[^0-9a-fA-F]/g, "");
  return hexlify(Buffer.from(stripped, "hex"));
}
