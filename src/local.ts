#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { createSakupi01ZennMCPServer } from "./server.js";
import type { Sakupi01ZennMCPServer } from "./types.js";

// Create and start the server
const server: McpServer = createSakupi01ZennMCPServer();

/**
 * Handle process signals and initialize server
 */
async function main() {
  try {
    const transport = new StdioServerTransport();

    // Connect MCP server with transport
    await server.connect(transport);

    console.error("MCP server connected");

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.error("Shutting down MCP server...");
      // await cleanup();
      process.exit(0);
    });

    // Additional signal handlers could be added here
    process.on("SIGTERM", async () => {
      console.error("Received SIGTERM, shutting down MCP server...");
      // await cleanup();
      process.exit(0);
    });
  } catch (err) {
    console.error("Error setting up server:", err);
    process.exit(1);
  }
}

// Execute main function
await main();
