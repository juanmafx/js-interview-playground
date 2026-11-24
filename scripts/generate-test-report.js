import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { run } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const REPORT_DIRECTORY = path.join(ROOT, "reports", "tests");

async function findTestFiles() {
  const entries = await readdir(path.join(ROOT, "tests"), { recursive: true });
  return entries
    .filter((entry) => entry.endsWith(".test.js"))
    .sort()
    .map((entry) => path.join(ROOT, "tests", entry));
}

async function collectResults(files) {
  const results = [];
  const statusByEvent = { "test:pass": "passed", "test:fail": "failed" };

  for await (const event of run({ files, concurrency: true })) {
    const status = statusByEvent[event.type];
    if (!status || event.data.details?.type === "suite") {
      continue;
    }
    const isFileLevelEvent = !event.data.file || path.isAbsolute(event.data.name);
    if (isFileLevelEvent && status === "passed") {
      continue;
    }
    const file = event.data.file ?? event.data.name;
    results.push({
      file: path.relative(ROOT, file).split(path.sep).join("/"),
      name: isFileLevelEvent ? "test file failed to run" : event.data.name,
      status: event.data.skip === undefined ? status : "skipped",
    });
  }

  return results.sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));
}

function renderMarkdown(report) {
  const rows = report.tests.map(({ file, name, status }) => `| ${file} | ${name} | ${status} |`);
  return [
    "# Test Report",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Node.js: ${report.nodeVersion}`,
    `- Platform: ${report.platform}`,
    `- Total: ${report.totals.total}`,
    `- Passed: ${report.totals.passed}`,
    `- Failed: ${report.totals.failed}`,
    `- Skipped: ${report.totals.skipped}`,
    "",
    "| File | Test | Status |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

const tests = await collectResults(await findTestFiles());
const countStatus = (status) => tests.filter((entry) => entry.status === status).length;
const report = {
  generatedAt: new Date().toISOString(),
  nodeVersion: process.version,
  platform: `${process.platform}-${process.arch}`,
  totals: {
    total: tests.length,
    passed: countStatus("passed"),
    failed: countStatus("failed"),
    skipped: countStatus("skipped"),
  },
  tests,
};

await mkdir(REPORT_DIRECTORY, { recursive: true });
await writeFile(path.join(REPORT_DIRECTORY, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(path.join(REPORT_DIRECTORY, "latest.md"), renderMarkdown(report));

console.log(JSON.stringify(report.totals));
if (report.totals.failed > 0 || report.totals.total === 0) {
  process.exitCode = 1;
}
