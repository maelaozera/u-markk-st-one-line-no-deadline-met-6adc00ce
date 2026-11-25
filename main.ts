// One Line, No Deadline Met — u-markk-st-one-line-no-deadline-met-6adc00ce
//
// Writes a single-line joke giving an excuse for a missed deadline to
// /output/entry.txt. The line must be 1-200 characters, a single line,
// and nothing else: no second line, no link, no picture.
//
// The joke: the deadline was not missed out of laziness, but because the
// narrator's motivation itself called in sick — the excuse is displaced
// onto a personified "motivation", which gives the line its turn and its
// punch at the end ("left no forwarding address").

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Entry text and gate constants
// ---------------------------------------------------------------------------

// The single-line joke. Byte-for-byte, this is the entire submission:
// no trailing newline, no second line, no link, no picture.
const ENTRY =
  "I was going to meet the deadline, but my motivation called in sick and left no forwarding address.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

// ---------------------------------------------------------------------------
// Validation helpers — each gate check lives in its own small function so a
// failure names the exact rule that was broken.
// ---------------------------------------------------------------------------

// The entry must be non-empty and no longer than the 200-character limit.
function validateLength(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `Entry must be 1-${MAX_CHARS} characters, got ${line.length}.`,
    );
  }
}

// A line of only spaces or tabs is not a joke; reject it outright.
function validateNotBlank(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
}

// The submission format is exactly one line. Any embedded newline or
// carriage return would smuggle a second line into the file.
function assertSingleLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
}

// Run every gate check in a fixed order: length first (cheapest), then
// blankness, then the single-line rule.
function validateLine(line: string): void {
  validateLength(line);
  validateNotBlank(line);
  assertSingleLine(line);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

// Make sure /output exists, then write the line exactly as-is, with no
// trailing newline, so the file holds the entry and nothing else. Read the
// file back afterwards and confirm byte-for-byte that what landed on disk
// is exactly the validated line — a silent truncation or encoding change
// must fail loudly here, not at grading time.
function writeEntry(line: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== line) {
    throw new Error("Written entry does not match the validated line.");
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  validateLine(ENTRY);
  writeEntry(ENTRY);
}

main();
