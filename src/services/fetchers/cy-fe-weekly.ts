import fs from "node:fs/promises";
import path from "node:path";
import type { Blog } from "../../types.js";
import { ZennArticleObjSchema, type ZennArticleType } from "../schemas/zenn.js";

const ZENN_API_URL = "https://zenn.dev/api/articles?username=s_a_k_u&order=latest";
const GITHUB_RAW_BASE_URL = "https://raw.githubusercontent.com/sakupi01/zenn-articles/refs/heads/main/articles";
const FRONTEND_WEEKLY_PREFIX = "frontend_weekly_";

/**
 * Parse markdown content and extract blog metadata
 * 
 * @param content Markdown content
 * @param fileName Optional file name to use as fallback for slug
 * @param article Optional Zenn article object to use for metadata
 * @returns Blog object or null if parsing fails
 */
const parseMarkdownToPost = (
  content: string, 
  fileName?: string,
  article?: ZennArticleType
): Blog | null => {
  try {
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

    // Generate slug and link
    const slug = fileName 
      ? fileName.replace(/\.md$/, "") 
      : article?.path.split('/').pop() || '';
    
    // Generate link based on available information
    const link = article 
      ? `https://zenn.dev${article.path}` 
      : `https://zenn.dev/cybozu_frontend/articles/${slug}`;

    // Extract publication date
    const pubDate = article?.published_at || (publishedAtMatch
      ? new Date(publishedAtMatch[1].split("#")[0].trim()).toISOString()
      : new Date().toISOString());

    // Extract title
    const title = article?.title || (titleMatch ? titleMatch[1] : slug);

    return {
      title,
      pubDate,
      description,
      link,
      content: markdownContent,
      tags: ["CybozuFrontendWeekly", "frontend"],
    };
  } catch (error) {
    console.error(`Error parsing markdown content: ${error}`);
    return null;
  }
};


/**
 * Fetch frontend weekly articles from Zenn API or local files
 * 
 * @param fixtureDir Optional directory for local files (for testing)
 * @returns Array of Blog objects
 */
export const fetchFrontendWeekly = async (
  fixtureDir?: string,
): Promise<Blog[]> => {
  // If fixtureDir is provided, use local files instead of API
  if (fixtureDir) {
    return fetchFromLocalFiles(fixtureDir);
  }
  
  try {
    // Fetch articles from Zenn API
    const response = await fetch(ZENN_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Zenn API: ${response.statusText}`);
    }
    
    const data = await response.json();
    const parseResult = ZennArticleObjSchema.safeParse(data);
    
    if (!parseResult.success) {
      console.error("Failed to parse Zenn API response:", parseResult.error);
      return [];
    }
    
    const zennArticles = parseResult.data.articles;
    
    // Filter frontend weekly articles and fetch their content
    const frontendWeeklyArticles = zennArticles.filter(article => {
      const slug = article.path.split('/').pop() || '';
      return slug.startsWith(FRONTEND_WEEKLY_PREFIX);
    });
    
    const blogs = await Promise.all(
      frontendWeeklyArticles.map(async (article) => {
        const slug = article.path.split('/').pop() || '';
        const githubUrl = `${GITHUB_RAW_BASE_URL}/${slug}.md`;
        
        try {
          const contentResponse = await fetch(githubUrl);
          if (!contentResponse.ok) {
            throw new Error(`Failed to fetch article content: ${contentResponse.statusText}`);
          }
          
          const content = await contentResponse.text();
          return parseMarkdownToPost(content, undefined, article);
        } catch (error) {
          console.error(`Error fetching article content for ${slug}: ${error}`);
          return null;
        }
      }),
    );
    
    return blogs.filter((blog): blog is Blog => blog !== null);
  } catch (error) {
    console.error(`Error fetching frontend weekly articles: ${error}`);
    return [];
  }
};

/**
 * Fetch blogs from local files (for testing purposes)
 */
const fetchFromLocalFiles = async (fixtureDir: string): Promise<Blog[]> => {
  const articlesDir = path.join(
    process.cwd(),
    fixtureDir,
  );
  
  try {
    const files = await fs.readdir(articlesDir);
    const frontendWeeklyFiles = files.filter(
      (file) => file.startsWith(FRONTEND_WEEKLY_PREFIX) && file.endsWith(".md"),
    );

    const blogs = await Promise.all(
      frontendWeeklyFiles.map(async (file) => {
        const filePath = path.join(articlesDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        return parseMarkdownToPost(content, file);
      }),
    );

    return blogs.filter((blog): blog is Blog => blog !== null);
  } catch (error) {
    console.error(`Error fetching frontend weekly articles from local files: ${error}`);
    return [];
  }
};
