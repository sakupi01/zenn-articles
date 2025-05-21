import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerFeWeeklyPrompt } from "./fe_weekly.js";

/**
 * Register all prompts with the server
 * @param server MCP Server instance
 */
export const registerAllPrompts = (server: McpServer) => {
  registerFeWeeklyPrompt(server);
};
