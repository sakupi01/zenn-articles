import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBlogSearchTool } from "./tools/articles-search.js";
import type { Blog } from "./types.js";

/**
 * Create a Zenn Articles MCP Server
 * @param fixtures Configuration options such as test data
 */
export const createSakupi01ZennMCPServer = (fixtures?: {
  blogs?: Blog[];
}): McpServer => {
  const server = new McpServer({
    name: "sakupi01-zenn-articles",
    version: "0.1.0",
  });

  // Register all tools
  registerBlogSearchTool(server, fixtures?.blogs);

  return server;
};
