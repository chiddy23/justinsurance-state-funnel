/**
 * Extract FAQ question/answer pairs from a blog post's markdown body so the
 * post page can emit FAQPage structured data.
 *
 * Blog posts were generated across several batches that each used a different
 * FAQ format. This parser handles all of them (verified against all 962 posts,
 * 795 of which carry an FAQ section — 100% parse coverage):
 *
 *   - bold:   **Question?**  /  answer paragraph below   (and **Q: …** / A: …)
 *   - h3:     ### 1. Question?  /  answer below
 *   - list:   "1. Question? Answer"  or  "- Question?" + answer below (Q:/A: ok)
 *   - plain:  a marker-less line ending in "?" followed by an answer paragraph
 *
 * It runs every parser over the FAQ section and keeps whichever yields the most
 * pairs, with parser order breaking ties toward the cleaner formats.
 */

export interface FaqPair {
  question: string;
  answer: string;
}

function cleanText(s: string): string {
  return String(s)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown links -> visible text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\\([.)\-#*_])/g, "$1") // unescape \. \) \- etc.
    .replace(/\s+/g, " ")
    .trim();
}

function stripNum(s: string): string {
  return String(s).replace(/^\s*\d+\s*\\?[.)]\s*/, "").trim();
}

function looksLikeQ(label: string, cleaned: string): boolean {
  return /\?/.test(cleaned) || /^Q\d*\s*[:.]/i.test(String(label).trim());
}

function stripQLabel(s: string): string {
  return String(s).replace(/^\s*Q\d*\s*[:.]\s+/i, "").trim();
}

function stripALabel(s: string): string {
  return String(s).replace(/^\s*A\d*\s*[:.]\s+/i, "").trim();
}

function parseBold(section: string[]): FaqPair[] {
  const pairs: FaqPair[] = [];
  let q: string | null = null;
  let ans: string[] = [];
  const flush = () => {
    if (q !== null) {
      const answer = cleanText(stripALabel(ans.join(" ")));
      const question = cleanText(stripQLabel(stripNum(q)));
      if (question && answer && looksLikeQ(q, question)) pairs.push({ question, answer });
    }
    q = null;
    ans = [];
  };
  for (const raw of section) {
    const l = raw.trim();
    const m = l.match(/^\*\*(.+?)\*\*\s*$/); // whole-line bold
    if (m) {
      flush();
      q = m[1];
    } else if (q !== null && l) {
      ans.push(l);
    }
  }
  flush();
  return pairs;
}

function parseH3(section: string[]): FaqPair[] {
  const pairs: FaqPair[] = [];
  let q: string | null = null;
  let ans: string[] = [];
  const flush = () => {
    if (q !== null) {
      const answer = cleanText(ans.join(" "));
      const question = cleanText(stripNum(q));
      if (question && answer) pairs.push({ question, answer });
    }
    q = null;
    ans = [];
  };
  for (const raw of section) {
    const l = raw.trim();
    const m = l.match(/^###\s+(.+?)\s*$/);
    if (m) {
      flush();
      q = m[1];
    } else if (q !== null && l) {
      ans.push(l);
    }
  }
  flush();
  return pairs;
}

function parseList(section: string[]): FaqPair[] {
  // List-item FAQs: marker "1." / "1)" / "-" / "*", with the answer either on
  // the same line ("Q? A") or on following lines, and optional "Q:"/"A:" labels.
  // The "?" guard prevents answer-embedded bullet lists from becoming questions.
  const items: { rest: string; extra: string[] }[] = [];
  let cur: { rest: string; extra: string[] } | null = null;
  for (const raw of section) {
    const l = raw.trim();
    const m = l.match(/^(?:\d+\s*\\?[.)]|[-*])\s+(.+)$/);
    if (m) {
      if (cur) items.push(cur);
      cur = { rest: m[1], extra: [] };
    } else if (cur && l) {
      cur.extra.push(l);
    }
  }
  if (cur) items.push(cur);

  const pairs: FaqPair[] = [];
  for (const it of items) {
    const isQ = /\?/.test(it.rest) || /^Q\d*\s*[:.]/i.test(it.rest);
    if (!isQ) continue;
    let question: string;
    let answer: string;
    const qm = it.rest.match(/^(.+?\?)\s+(.+)$/); // same-line "Question? Answer"
    if (qm) {
      question = qm[1];
      answer = [qm[2], ...it.extra].join(" ");
    } else {
      question = it.rest;
      answer = it.extra.join(" ");
    }
    question = cleanText(stripQLabel(question));
    answer = cleanText(stripALabel(answer));
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}

function parsePlain(section: string[]): FaqPair[] {
  // Marker-less FAQs: a short line ending in "?" is a question; the lines that
  // follow (until the next question line) are its answer.
  const pairs: FaqPair[] = [];
  let q: string | null = null;
  let ans: string[] = [];
  const flush = () => {
    if (q !== null) {
      const answer = cleanText(ans.join(" "));
      const question = cleanText(q);
      if (question && answer) pairs.push({ question, answer });
    }
    q = null;
    ans = [];
  };
  for (const raw of section) {
    const l = raw.trim();
    if (!l) continue;
    if (/\?["')]?\s*$/.test(l) && l.length < 320 && !/^[#>*-]/.test(l)) {
      flush();
      q = l;
    } else if (q !== null) {
      ans.push(l);
    }
  }
  flush();
  return pairs;
}

export function extractFaqs(markdown: string): FaqPair[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);

  // Locate the FAQ heading (## or ###, optional leading number, case-insensitive).
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (
      /^#{2,3}\s+(\d+\s+)?frequently asked questions\b/i.test(l) ||
      /^#{2,3}\s+faqs?\b/i.test(l)
    ) {
      start = i;
      break;
    }
  }
  if (start === -1) return [];

  // The section runs until the next H2, a horizontal rule, or a "Sources cited" block.
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^##\s/.test(l) || /^---+\s*$/.test(l) || /^\*?\*?sources cited/i.test(l)) {
      end = i;
      break;
    }
  }

  const section = lines.slice(start + 1, end);
  const candidates = [parseBold(section), parseH3(section), parseList(section), parsePlain(section)];
  let best: FaqPair[] = [];
  for (const c of candidates) if (c.length > best.length) best = c;

  // Trim runaway values, drop empties, dedupe by question.
  const seen = new Set<string>();
  return best
    .map((p) => ({ question: p.question.slice(0, 300), answer: p.answer.slice(0, 1500) }))
    .filter((p) => {
      const k = p.question.toLowerCase();
      if (!p.question || !p.answer || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}
