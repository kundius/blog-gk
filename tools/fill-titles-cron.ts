import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const CONTEXT_FILE = "empty-titles-context.json";
const APPLIED_FILE = "applied-titles.json";

// ── Environment detection ───────────────────────────────────────────────────

function detectExec(): { exec: (cmd: string) => string; backend: "docker" | "podman" | "direct" } {
  try {
    execSync("docker compose ps", { stdio: "ignore", cwd: PROJECT_ROOT });
    return {
      exec: (cmd: string) =>
        execSync(`docker compose exec -T backend sh -c "${cmd}"`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }).toString(),
      backend: "docker",
    };
  } catch {}

  try {
    execSync("podman compose ps", { stdio: "ignore", cwd: PROJECT_ROOT });
    return {
      exec: (cmd: string) =>
        execSync(`podman compose exec -T backend sh -c "${cmd}"`, {
          cwd: PROJECT_ROOT,
          stdio: "pipe",
        }).toString(),
      backend: "podman",
    };
  } catch {}

  return {
    exec: (cmd: string) =>
      execSync(cmd, { cwd: resolve(PROJECT_ROOT, "backend"), stdio: "pipe" }).toString(),
    backend: "direct",
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function runFind(env: ReturnType<typeof detectExec>): number {
  console.log(`[${env.backend}] Running find-empty-titles.ts...`);
  env.exec("npx tsx prisma/find-empty-titles.ts");

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

function runApply(env: ReturnType<typeof detectExec>): void {
  console.log(`[${env.backend}] Running apply-file-titles.ts...`);
  env.exec("npx tsx prisma/apply-file-titles.ts");
}

// ── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const env = detectExec();
  console.log(`Environment: ${env.backend}`);

  // Step 1: Find
  const count = runFind(env);
  if (count === 0) return;

  // Step 2: Run opencode
  const prompt = [
    "Прочитай файл empty-titles-context.json в текущей директории.",
    "Для каждого объекта сгенерируй title на русском языке по следующим правилам:",
    "",
    "Формат title по типу context.type:",
    '- thumbnail: "{entityName}"',
    '- album_photo: "Фото из альбома «{entityName}»"',
    '- content_step: "{entityName}: {краткое описание изображения по rawContext}"',
    '- content_inline: "{entityName}: {краткое описание изображения по rawContext}"',
    "",
    "Требования к title:",
    "- Русский язык",
    "- 3-15 слов, не более 125 символов",
    "- Если rawContext содержит текст — используй его для описания изображения",
    "- Если rawContext null — используй entityName",
    "",
    "Запиши результат в файл applied-titles.json в формате:",
    '[{"fileId":"...","title":"...","articleId":"...","filenameDisk":"..."}]',
    "",
    "Не изменяй никакие другие файлы. Только applied-titles.json.",
  ].join("\n");

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

  runApply(env);
  console.log("Done.");
}

main();
