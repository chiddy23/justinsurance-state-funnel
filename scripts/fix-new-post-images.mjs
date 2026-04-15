import fs from "node:fs";
import path from "node:path";

// Map new posts to the closest existing state image (we verified these exist in public/blog/images/)
const imageMap = {
  "src/content/blog/state-license-georgia/how-to-get-your-georgia-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/avoid-these-common-mistakes-for-georgia-insurance-ce-approval.jpg",
  "src/content/blog/state-license-ohio/how-to-get-your-ohio-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/avoid-these-common-mistakes-with-ohio-insurance-license-renewal.jpg",
  "src/content/blog/state-license-illinois/how-to-get-your-illinois-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/avoid-these-common-mistakes-in-illinois-insurance-license-requirements.jpg",
  "src/content/blog/state-license-pennsylvania/how-to-get-your-pennsylvania-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/avoid-these-common-mistakes-with-pennsylvania-insurance-license-renewal.jpg",
  "src/content/blog/state-license-arizona/how-to-get-your-arizona-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/affordable-tips-to-lower-your-arizona-insurance-license-cost.jpg",
  "src/content/blog/state-license-north-carolina/how-to-get-your-north-carolina-insurance-license-2026-step-by-step-guide.md":
    "/blog/images/avoid-these-mistakes-when-getting-your-north-carolina-life-insurance-license.jpg",
  "src/content/blog/florida-insurance-license/best-florida-insurance-prelicensing-courses-2026.md":
    "/blog/images/discover-the-true-florida-insurance-license-cost-for-you.jpg",
};

for (const [file, newImg] of Object.entries(imageMap)) {
  let src = fs.readFileSync(file, "utf8");
  src = src.replace(
    /^image:\s*\/blog\/images\/[^\n]+/m,
    `image: ${newImg}`
  );
  fs.writeFileSync(file, src);
  console.log(`Updated ${path.basename(file)} -> ${newImg}`);
}
