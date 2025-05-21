import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { createSakupi01ZennMCPServer } from "./server.js";
import type { Sakupi01ZennMCPServer } from "./types.js";

const DEFAULT_PORT = process.env.PORT
  ? Number.parseInt(process.env.PORT)
  : 8000;
const MCP_ENDPOINT = "/mcp";

const ERROR_RESPONSES = {
  methodNotAllowed: {
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed.",
    },
    id: null,
  },
  internalServerError: {
    jsonrpc: "2.0",
    error: {
      code: -32603,
      message: "Internal server error",
    },
    id: null,
  },
};

/**
 * Server configuration interface
 */
interface ServerConfig {
  port?: number;
  mcpServer?: Sakupi01ZennMCPServer;
}

// Create and start the server
const server: McpServer = createSakupi01ZennMCPServer();

/**
 * Configure and set up the Express application
 */
function setupExpressApp() {
  const app = express();
  app.use(express.json());
  return app;
}

/**
 * Configure and set up the transport layer
 */
function setupTransport() {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // For stateless servers
  });
}

/**
 * Set up route handlers for the Express application
 */
function setupRoutes(
  app: express.Express,
  transport: StreamableHTTPServerTransport,
) {
  // POST handler for MCP requests
  app.post(MCP_ENDPOINT, async (req, res) => {
    console.error("Received MCP request:", req.body);
    try {
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.status(500).json(ERROR_RESPONSES.internalServerError);
      }
    }
  });

  // GET handler (for SSE compatibility)
  app.get(MCP_ENDPOINT, (_req, res) => {
    console.error("Received GET MCP request");
    res.writeHead(405).end(JSON.stringify(ERROR_RESPONSES.methodNotAllowed));
  });

  // DELETE handler (for stateful servers)
  app.delete(MCP_ENDPOINT, (_req, res) => {
    console.error("Received DELETE MCP request");
    res.writeHead(405).end(JSON.stringify(ERROR_RESPONSES.methodNotAllowed));
  });
}

/**
 * Create a cleanup function for graceful server shutdown
 */
function createCleanupFunction(
  server: ReturnType<typeof express.application.listen>,
  transport: StreamableHTTPServerTransport,
  mcpServer: Sakupi01ZennMCPServer,
) {
  return async () => {
    try {
      console.error("Closing transport");
      await transport.close();
    } catch (error) {
      console.error("Error closing transport:", error);
    }

    await mcpServer.close();

    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

    console.error("Server shutdown complete");
  };
}

/**
 * Start the server with the given configuration
 * @param config Server configuration options
 * @returns Server instance and cleanup function
 */
export async function runServer({
  port = DEFAULT_PORT,
  mcpServer = server,
}: ServerConfig = {}): Promise<{
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  cleanup: () => Promise<void>;
}> {
  // Setup application and transport
  const app = setupExpressApp();
  const transport = setupTransport();

  // Connect MCP server with transport
  await mcpServer.connect(transport);

  // Setup route handlers
  setupRoutes(app, transport);

  // Start the server
  const server = app.listen(port, () => {
    console.error(
      `Server is running on http://localhost:${port}${MCP_ENDPOINT}`,
    );
  });

  // Create cleanup function
  const cleanup = createCleanupFunction(server, transport, mcpServer);

  return { server, cleanup };
}
