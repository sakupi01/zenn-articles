import { McpAgent } from "agents/mcp";
import { createSakupi01ZennMCPServer } from "./server.js";

// Define our MCP agent with tools for cloudflare remote mcp server
export class Sakupi01ZennMCP extends McpAgent {
  server = createSakupi01ZennMCPServer();

  async init() {}
}

export default {
  // @ts-ignore < Ignore the error for now >
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return Sakupi01ZennMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return Sakupi01ZennMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
