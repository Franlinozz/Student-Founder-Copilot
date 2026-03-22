import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSubmissionPack } from "../src/lib/packBuilder";

const inputPath = process.argv[2] ?? "./idea.txt";
const idea = readFileSync(inputPath, "utf-8").trim();

const result = buildSubmissionPack({ idea });
const outputPath = join(process.cwd(), "pack-output.md");
writeFileSync(outputPath, result.markdown, "utf-8");

console.log("Generated submission pack →", outputPath);
console.log("Summary hash:", result.summaryHash);
