import fs from "node:fs";
const file = "src/lib/testimonials.ts";
let src = fs.readFileSync(file, "utf8");

// Patterns that indicate a comment is a question, off-topic, or inappropriate
// (rather than a positive testimonial)
const REMOVE_PATTERNS = [
  "Please help!",
  "My score was 86 and i needed a 90",
  "Have my test tmrw here in Missouri Also, what",
  "she is gorgeous",
  "Did you pass? I test next week",
  "very overwhelmed",
];

// Remove any testimonial block containing these phrases
let removed = 0;
for (const phrase of REMOVE_PATTERNS) {
  // Match: "  {\n ... text: \"... ${phrase} ...\",\n  },\n"
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`  \\{\\s*\\n(?:    [^\\n]+\\n){1,8}    text: "[^"]*${escaped}[^"]*",\\s*\\n(?:    [^\\n]+\\n){0,3}  \\},?\\s*\\n`, "g");
  const before = src.length;
  src = src.replace(re, "");
  if (src.length < before) {
    removed++;
    console.log(`Removed: ...${phrase.slice(0, 40)}...`);
  }
}

fs.writeFileSync(file, src);
console.log(`\nTotal removed: ${removed}`);
