/**
 * Thin wrangler wrapper for the import pipeline.
 *
 * Invokes wrangler's JS entry directly with the current node binary —
 * spawning npx.cmd with shell:false throws EINVAL on modern Node/Windows
 * (same proven pattern as scripts/migrate-files-to-r2.mjs).
 *
 * Auth is ambient (wrangler login); no secrets in code.
 */

import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const WRANGLER_JS = join(ROOT, "node_modules", "wrangler", "bin", "wrangler.js");

export const DB_NAME = "ilmlibrary";
export const BUCKET = "ilmlibrary-files";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run wrangler with the given args array. Resolves { stdout, stderr, code }. */
export function run(argsArray) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [WRANGLER_JS, ...argsArray], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code }));
  });
}

/** Extract the JSON payload from wrangler --json stdout (tolerates banner noise). */
function parseWranglerJson(stdout) {
  const start = stdout.indexOf("[");
  const startObj = stdout.indexOf("{");
  const s = start === -1 ? startObj : startObj === -1 ? start : Math.min(start, startObj);
  if (s === -1) throw new Error(`no JSON found in wrangler output: ${stdout.slice(0, 300)}`);
  const end = Math.max(stdout.lastIndexOf("]"), stdout.lastIndexOf("}"));
  return JSON.parse(stdout.slice(s, end + 1));
}

/** Execute SQL against the remote D1 database, return parsed result rows. */
export async function d1Query(sql) {
  const { stdout, stderr, code } = await run([
    "d1", "execute", DB_NAME, "--remote", "--json", "--command", sql,
  ]);
  if (code !== 0) {
    throw new Error(`wrangler d1 execute failed (exit ${code}): ${(stderr || stdout).slice(-600)}`);
  }
  const parsed = parseWranglerJson(stdout);
  const batches = Array.isArray(parsed) ? parsed : [parsed];
  return batches.flatMap((b) => b?.results ?? []);
}

/** Execute a SQL file against the remote D1 database. */
export async function d1ExecuteFile(sqlPath) {
  const { stdout, stderr, code } = await run([
    "d1", "execute", DB_NAME, "--remote", "--json", "--file", sqlPath,
  ]);
  if (code !== 0) {
    throw new Error(`wrangler d1 execute --file failed (exit ${code}): ${(stderr || stdout).slice(-600)}`);
  }
  return parseWranglerJson(stdout);
}

/** Upload a local file to R2 under `key`, with 2 retries. */
export async function r2Put(key, filePath, contentType) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { stdout, stderr, code } = await run([
      "r2", "object", "put", `${BUCKET}/${key}`,
      `--file=${filePath}`, `--content-type=${contentType}`, "--remote",
    ]);
    if (code === 0) return;
    lastErr = new Error(`wrangler r2 put ${key} failed (exit ${code}): ${(stderr || stdout).slice(-400)}`);
    if (attempt < 3) await sleep(1500 * attempt);
  }
  throw lastErr;
}
