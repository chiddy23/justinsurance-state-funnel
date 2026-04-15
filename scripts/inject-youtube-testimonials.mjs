import fs from "node:fs";

const source = fs.readFileSync("C:/Users/Chidd/Downloads/youtube-testimonials-mined.txt", "utf8");
const target = "src/lib/testimonials.ts";
let content = fs.readFileSync(target, "utf8");

// Locate the YOUTUBE_COMMENTS: Testimonial[] = [ ... ]; block and replace its body
const marker = "const YOUTUBE_COMMENTS: Testimonial[] = [";
const startIdx = content.indexOf(marker);
if (startIdx < 0) {
  console.error("Could not find YOUTUBE_COMMENTS array in", target);
  process.exit(1);
}
const bodyStart = startIdx + marker.length;
// Find the matching closing "];" after bodyStart
const endIdx = content.indexOf("\n];", bodyStart);
if (endIdx < 0) {
  console.error("Could not find closing bracket for YOUTUBE_COMMENTS");
  process.exit(1);
}

const newBody = "\n" + source.trimEnd() + "\n";
content = content.slice(0, bodyStart) + newBody + content.slice(endIdx);

fs.writeFileSync(target, content);
console.log(`Injected ${source.match(/^  \{$/gm)?.length ?? 0} testimonials into ${target}`);
