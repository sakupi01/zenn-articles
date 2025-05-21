import fs from "node:fs/promises";
import path from "node:path";
import type { Blog } from "../../types.js";

/**
 * Fetch blogs from the articles directory which starts from frontend_weekly_*
 */
export const fetchFrontendWeekly = async (
  fixtureDir?: string,
): Promise<Blog[]> => {
  const articlesDir = path.join(
    process.cwd(),
    fixtureDir ? fixtureDir : "articles",
  );
  try {
    const files = await fs.readdir(articlesDir);
    const frontendWeeklyFiles = files.filter(
      (file) => file.startsWith("frontend_weekly_") && file.endsWith(".md"),
    );

    const blogs = await Promise.all(
      frontendWeeklyFiles.map(async (file) => {
        const filePath = path.join(articlesDir, file);
        const content = await fs.readFile(filePath, "utf-8");

        // Parse frontmatter metadata using regex
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";

        // Extract metadata
        const titleMatch = frontmatter.match(/title:\s*"(.*)"/);
        const publishedAtMatch = frontmatter.match(/published_at:\s*(.*)/);

        // Extract description (first paragraph after the frontmatter)
        const markdownContent = content
          .replace(/^---\n[\s\S]*?\n---/, "")
          .trim();
        const descriptionMatch = markdownContent.match(
          /# はじめに\n\n(.*?)(\n\n|$)/s,
        );
        const description = descriptionMatch
          ? descriptionMatch[1].replace(/\n/g, " ").trim()
          : "サイボウズ社内で毎週火曜日に開催しているFrontend Weeklyの記事です。";

        // Generate link from filename
        const slug = file.replace(/\.md$/, "");
        const link = `https://zenn.dev/cybozu_frontend/articles/${slug}`;

        // Extract publication date
        const pubDate = publishedAtMatch
          ? new Date(publishedAtMatch[1].split("#")[0].trim()).toISOString()
          : new Date().toISOString();

        // Extract title
        const title = titleMatch ? titleMatch[1] : slug;

        return {
          title,
          pubDate,
          description,
          link,
          content: markdownContent,
          tags: ["CybozuFrontendWeekly", "frontend"],
        };
      }),
    );

    return blogs;
  } catch (error) {
    console.error(`Error fetching frontend weekly articles: ${error}`);
    return [];
  }
};
