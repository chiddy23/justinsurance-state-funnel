import fs from "node:fs";
let src = fs.readFileSync("src/lib/states.ts", "utf8");

const fixes = {
  Indiana: {
    lifeUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=00268c67-a7b5-4e41-bb6b-bcb725aa0227",
    healthUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=f782d583-572a-465d-bb0c-02669ab82337",
  },
  Maryland: {
    lifeUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=4bb00ba4-d22b-4652-8ef4-c024130390ed",
    healthUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=abc7548f-965b-40f9-8a40-8d86a331a793",
  },
  "Rhode Island": {
    lifeUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=e6e1ffd9-9f45-4969-966c-10b3d6bccc7c",
    healthUrl: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=58a7e2f9-bca8-4286-ae4a-1b06b767ca23",
  },
};

for (const [state, urls] of Object.entries(fixes)) {
  const escaped = state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const [field, url] of Object.entries(urls)) {
    const re = new RegExp(
      `(name: "${escaped}",[\\s\\S]*?practiceExams:\\s*\\{[\\s\\S]*?${field}:\\s*)null`
    );
    const before = src;
    src = src.replace(re, (_, p1) => `${p1}${JSON.stringify(url)}`);
    if (src === before) console.warn(`  WARN: ${state}.${field} not patched`);
    else console.log(`  OK: ${state}.${field}`);
  }
}

fs.writeFileSync("src/lib/states.ts", src);
