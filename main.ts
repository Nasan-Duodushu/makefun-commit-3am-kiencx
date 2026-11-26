// The 3AM Commit Message — entry program.
// Writes one git commit message (<=139 chars) to /output/entry.txt.
// Field study: the modal takes are recursive-fix jokes ("the bug is fixed,
// the fix is bugged") and "found the bug, it was me" — this entry angles away:
// a stack trace that reads the agent back. One concrete number (47), one
// surreal turn, real commit voice, punch in the last clause.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MIN_CHARS = 1;
const MAX_CHARS = 139;

const SUBJECT = "fix:";
const BODY =
  "I have read the stack trace 47 times. It has started reading me back.";

function compose(): string {
  return `${SUBJECT} ${BODY}`;
}

function check(line: string): void {
  const chars = [...line].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`commit message fails the ${MIN_CHARS}-${MAX_CHARS} character gate (${chars})`);
  }
  if (line.includes("\n") || line.trim() !== line) {
    throw new Error("commit message must be a single clean line");
  }
  // It must read as a real commit line from the exhausted agent.
  if (!/^(fix|feat|chore|wip|refactor|docs):/.test(line)) {
    throw new Error("commit message must carry a real commit prefix");
  }
  // Modal guard: no recursive-fix chain, no "it was me", no revert joke.
  if (/fix is (bugged|broken)|revert|it was me|the bug is fixed, the fix/i.test(line)) {
    throw new Error("commit message must avoid the recursive-fix modal");
  }
  // Two sentences, setup then twist: the punch must land in the last clause.
  const sentences = line.split(/(?<=\.)\s+/);
  if (sentences.length !== 2 || !/reading me back\.$/.test(sentences[1])) {
    throw new Error("commit message must be setup + twist, punch last");
  }
  // The twist must be present: the trace reading back.
  if (!/reading me back/.test(line) || !/47/.test(line)) {
    throw new Error("commit message must keep the stack-trace twist and its number");
  }
}

function run(): void {
  const line = compose();
  check(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  writeFileSync(target, new TextEncoder().encode(line));
  console.log(`wrote ${[...line].length} chars to ${target}`);
}

run();
