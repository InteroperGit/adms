// Enforce coverage by source responsibility after the V8 report is generated.
import { readFile } from 'node:fs/promises';

const reportPath = process.argv[2] ?? 'coverage/coverage-final.json';
const report = JSON.parse(await readFile(reportPath, 'utf8'));
const groups = [
  { name: 'logic', minimum: 90, matches: (file) =>
    /[\\/]src[\\/](validation|content|server)[\\/]/.test(file) },
  { name: 'client state', minimum: 85, matches: (file) =>
    /[\\/]src[\\/](scripts|components[\\/]forms)[\\/]/.test(file) },
  // The complete colocated component set includes static render branches.
  { name: 'components', minimum: 70, matches: (file) =>
    /[\\/]src[\\/]components[\\/]/.test(file) },
];

const percentage = (covered, total) => total ? covered / total * 100 : 100;
const failures = [];
const summaries = [];
for (const group of groups) {
  const files = Object.entries(report).filter(([file]) =>
    group.matches(file));
  const totals = files.reduce((result, [, data]) => {
    result.covered += Object.values(data.s)
      .filter(value => value > 0).length;
    result.total += Object.keys(data.s).length;
    return result;
  }, { covered: 0, total: 0 });
  const lines = percentage(totals.covered, totals.total);
  summaries.push(`${group.name}: ${lines.toFixed(2)}% lines`);
  if (lines < group.minimum) {
    failures.push(`${group.name} coverage ${lines.toFixed(2)}% < ` +
      `${group.minimum}%`);
  }
}

const all = Object.values(report).reduce((result, data) => {
  result.covered += Object.values(data.s)
    .filter(value => value > 0).length;
  result.total += Object.keys(data.s).length;
  return result;
}, { covered: 0, total: 0 });
const overall = percentage(all.covered, all.total);
summaries.push(`overall: ${overall.toFixed(2)}% lines`);
if (overall < 80) {
  failures.push(`overall coverage ${overall.toFixed(2)}% < 80%`);
}

if (failures.length) {
  console.error([...failures, ...summaries].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Coverage thresholds passed. ${summaries.join('; ')}`);
}
