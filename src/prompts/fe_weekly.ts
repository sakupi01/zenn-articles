import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Register the frontend weekly prompt with the server
 * @param server MCP Server instance
 */
export const registerFeWeeklyPrompt = (server: McpServer) => {
  // Read the prompt template from the file
  const promptTemplate = fs.readFileSync(
    path.resolve(__dirname, "resources/weekly.prompt.md"),
    "utf-8",
  );

  server.prompt(
    "fe-weekly",
    "Generate frontend weekly content for given URLs",
    {
      urls: z.string().describe("URLs to generate frontend weekly content for"),
    },
    (args) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `${promptTemplate}\n\n以上に基づき、以下のURLについて記事を作成してください：\n\n${args.urls}`,
            },
          },
        ],
        tools: ["web-fetch", "search_cy_fe_articles", "get_eg_cy_fe_article"],
      };
    },
  );
};
