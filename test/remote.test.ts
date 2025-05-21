import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { describe, expect, test } from "vitest";
import { runServer } from "../src/remote";
import { createSakupi01ZennMCPServer } from "../src/server";
import { fetchFrontendWeekly } from "../src/services/fetchers/cy-fe-weekly";

const createConnection = async (url: string) => {
  const client = new Client({
    name: "example-client",
    version: "1.0.0",
  });
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    sessionId: undefined,
  });
  client.onerror = (error) => {
    console.error("Client error:", error);
  };

  await client.connect(transport);
  return client;
};

async function createTestServer() {
  // create mcp server with mock
  const mockArticle = await fetchFrontendWeekly("test/__fixtures__");

  const mcpServer = createSakupi01ZennMCPServer({
    blogs: mockArticle,
  });

  const port = Math.floor(Math.random() * (65535 - 1024) + 1024);

  // bootup mcp server
  const { cleanup } = await runServer({
    port,
    mcpServer,
  });
  return {
    cleanup,
    url: `http://localhost:${port}/mcp`,
  };
}

describe("Sakupi01 Zenn MCP Server", () => {
  test("should search articles from frontend_weekly_* with query", async () => {
    const { cleanup, url } = await createTestServer();

    // create mcp client
    const client = await createConnection(url);

    try {
      const response = await client.callTool({
        name: "search_cy_fe_articles",
        arguments: {
          query: "Form Control",
          limit: 2,
          offset: 0,
        },
      });

      expect(response.content).toStrictEqual([
        {
          type: "text",
          text:
            "{\n" +
            '  "total": 1,\n' +
            '  "offset": 0,\n' +
            '  "limit": 2,\n' +
            '  "order": "desc",\n' +
            '  "query": {\n' +
            '    "original": "Form Control",\n' +
            '    "keywords": [\n' +
            '      "form",\n' +
            '      "control"\n' +
            "    ],\n" +
            '    "exactPhrases": []\n' +
            "  },\n" +
            '  "results": [\n' +
            "    {\n" +
            '      "title": "Form Control Styling Level 1 など: Cybozu Frontend Weekly (2025-03-25号)",\n' +
            '      "pubDate": "2025-03-28T03:00:00.000Z",\n' +
            '      "description": "サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。",\n' +
            '      "link": "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_example",\n' +
            '      "content": "こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。\\n\\n# はじめに\\n\\nサイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。\\n\\n今回は、2025/03/25のFrontend Weeklyで取り上げた記事や話題を紹介します。",\n' +
            '      "tags": [\n' +
            '        "CybozuFrontendWeekly",\n' +
            '        "frontend"\n' +
            "      ],\n" +
            '      "score": 10\n' +
            "    }\n" +
            "  ]\n" +
            "}",
        },
      ]);
    } finally {
      client.close();
      await cleanup();
    }
  });
});
