import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const CONTEXT_FILE = "empty-titles-context.json";
const APPLIED_FILE = "applied-titles.json";

// ── Environment detection ───────────────────────────────────────────────────

type Env = {
  exec: (cmd: string) => string;
  copyFrom: (containerPath: string, hostPath: string) => void;
  copyTo: (hostPath: string, containerPath: string) => void;
  isContainer: boolean;
};

function detectExec(): Env {
  try {
    execSync("docker compose ps", { stdio: "ignore", cwd: PROJECT_ROOT });
    const client = "docker";
    return {
      exec: (cmd: string) =>
        execSync(`${client} compose exec -T backend sh -c "${cmd}"`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }).toString(),
      copyFrom: (containerPath: string, hostPath: string) =>
        execSync(`${client} compose cp backend:${containerPath} ${hostPath}`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }),
      copyTo: (hostPath: string, containerPath: string) =>
        execSync(`${client} compose cp ${hostPath} backend:${containerPath}`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }),
      isContainer: true,
    };
  } catch {}

  try {
    execSync("podman compose ps", { stdio: "ignore", cwd: PROJECT_ROOT });
    const client = "podman";
    return {
      exec: (cmd: string) =>
        execSync(`${client} compose exec -T backend sh -c "${cmd}"`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }).toString(),
      copyFrom: (containerPath: string, hostPath: string) =>
        execSync(`${client} compose cp backend:${containerPath} ${hostPath}`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }),
      copyTo: (hostPath: string, containerPath: string) =>
        execSync(`${client} compose cp ${hostPath} backend:${containerPath}`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }),
      isContainer: true,
    };
  } catch {}

  return {
    exec: (cmd: string) =>
      execSync(cmd, { cwd: PROJECT_ROOT, stdio: "pipe" }).toString(),
    copyFrom: () => {},
    copyTo: () => {},
    isContainer: false,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function runFind(env: Env): number {
  const label = env.isContainer ? "docker" : "direct";
  console.log(`[${label}] Running find-empty-titles.ts...`);
  env.exec("npx tsx prisma/find-empty-titles.ts");

  if (env.isContainer) {
    env.copyFrom("/app/" + CONTEXT_FILE, CONTEXT_FILE);
  }

  if (!existsSync(CONTEXT_FILE)) {
    console.log("empty-titles-context.json not found — nothing to do.");
    return 0;
  }

  const entries = JSON.parse(readFileSync(CONTEXT_FILE, "utf-8"));
  console.log(`Found ${entries.length} files with null title.`);

  if (entries.length === 0) {
    console.log("Nothing to do.");
    return 0;
  }

  return entries.length;
}

function runApply(env: Env): void {
  const label = env.isContainer ? "docker" : "direct";
  console.log(`[${label}] Running apply-file-titles.ts...`);
  env.exec("npx tsx prisma/apply-file-titles.ts");
}

// ── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const env = detectExec();
  const label = env.isContainer ? "docker" : "direct";
  console.log(`Environment: ${label}`);

  // Step 1: Find
  const count = runFind(env);
  if (count === 0) return;

  // Step 2: Run opencode
  const prompt = [
    "Заполни пустые title файлов.",
    "Используй скилл fill-file-titles.",
    "Данные в empty-titles-context.json в текущей директории.",
    "Результат запиши в applied-titles.json.",
    "Не изменяй никакие другие файлы.",
  ].join(" ");

  console.log("Running opencode run...");
  try {
    execSync(`opencode run --auto "${prompt.replace(/"/g, '\\"')}"`, {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
    });
  } catch (err) {
    console.error("opencode run failed:", err);
    process.exit(1);
  }

  // Step 3: Apply
  if (!existsSync(APPLIED_FILE)) {
    console.log("applied-titles.json not generated — opencode may have failed.");
    process.exit(1);
  }

  if (env.isContainer) {
    env.copyTo(APPLIED_FILE, "/app/" + APPLIED_FILE);
  }

  runApply(env);

  // Cleanup host copies
  rmSync(CONTEXT_FILE, { force: true });
  rmSync(APPLIED_FILE, { force: true });

  console.log("Done.");
}

main();
