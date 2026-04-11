import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  cluster: string;
  clusterName: string;
  type: "pillar" | "supporting";
  date: string;
  author: string;
  image: string;
  imageAlt: string;
  imageCredit?: string;
  content: string; // Rendered HTML string
}

export interface Cluster {
  slug: string;
  name: string;
  postCount: number;
  posts: BlogPost[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getClusterSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

async function parsePostFile(
  clusterSlug: string,
  fileName: string
): Promise<BlogPost> {
  const filePath = path.join(BLOG_DIR, clusterSlug, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: mdBody } = matter(raw);

  // Strip any leading "Meta Description …\n\nKeyword …\n\n" artifact lines
  // that some posts include before the real body.
  const cleanedBody = mdBody
    .replace(/^Meta Description\s.*\n+/i, "")
    .replace(/^Keyword\s.*\n+/i, "")
    .trim();

  const processedContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(cleanedBody);

  const slug = fileName.replace(/\.md$/, "");

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    keyword: data.keyword ?? "",
    cluster: data.cluster ?? clusterSlug,
    clusterName: data.clusterName ?? clusterSlug,
    type: data.type ?? "supporting",
    date: data.date ?? "",
    author: data.author ?? "Justin vom Eigen",
    image: data.image ?? "",
    imageAlt: data.imageAlt ?? "",
    imageCredit: data.imageCredit,
    content: String(processedContent),
  };
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

export function getAllPosts(): BlogPost[] {
  const clusters = getClusterSlugs();
  const posts: BlogPost[] = [];

  // We need sync loading for static param generation, so we read frontmatter
  // synchronously and skip the remark step (content not needed in list views).
  for (const cluster of clusters) {
    const dir = path.join(BLOG_DIR, cluster);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    for (const file of files) {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, "");

      posts.push({
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        keyword: data.keyword ?? "",
        cluster: data.cluster ?? cluster,
        clusterName: data.clusterName ?? cluster,
        type: data.type ?? "supporting",
        date: data.date ?? "",
        author: data.author ?? "Justin vom Eigen",
        image: data.image ?? "",
        imageAlt: data.imageAlt ?? "",
        imageCredit: data.imageCredit,
        content: "", // Not rendered in list context
      });
    }
  }

  return posts;
}

export async function getPostBySlug(
  cluster: string,
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, cluster, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parsePostFile(cluster, `${slug}.md`);
}

export function getPostsByCluster(cluster: string): BlogPost[] {
  return getAllPosts().filter((p) => p.cluster === cluster);
}

export function getAllClusters(): Cluster[] {
  const posts = getAllPosts();
  const map = new Map<string, BlogPost[]>();

  for (const post of posts) {
    if (!map.has(post.cluster)) map.set(post.cluster, []);
    map.get(post.cluster)!.push(post);
  }

  const clusters: Cluster[] = [];
  map.forEach((clusterPosts, slug) => {
    clusters.push({
      slug,
      name: clusterPosts[0]?.clusterName ?? slug,
      postCount: clusterPosts.length,
      posts: clusterPosts,
    });
  });

  return clusters.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getClusterBySlug(cluster: string): Cluster | null {
  const all = getAllClusters();
  return all.find((c) => c.slug === cluster) ?? null;
}

export function getRelatedPosts(
  cluster: string,
  currentSlug: string,
  limit = 3
): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.cluster === cluster && p.slug !== currentSlug)
    .slice(0, limit);
}

export function getLatestPosts(limit = 6): BlogPost[] {
  return getAllPosts()
    .sort((a, b) => {
      // Sort descending by date, fall back to slug order
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return 0;
    })
    .slice(0, limit);
}
