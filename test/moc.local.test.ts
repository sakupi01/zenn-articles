import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it } from "vitest";
import { test } from "vitest";
import { createSakupi01ZennMCPServer } from "../src/server.js";
import { fetchFrontendWeekly } from "../src/services/fetchers/cy-fe-weekly.js";

const createConnection = async (server: McpServer) => {
  const client = new Client({
    name: "example-client",
    version: "1.0.0",
  });

  // インメモリ通信チャネルの作成
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();

  // クライアントとサーバーを接続
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  return client;
};

async function createTestServer() {
  // create mcp server with mock
  const mockArticle = await fetchFrontendWeekly("test/__fixtures__");

  const mcpServer = createSakupi01ZennMCPServer({
    blogs: mockArticle,
  });

  return mcpServer;
}

describe("Sakupi01 Zenn MCP Server", () => {
  test("should search articles from frontend_weekly_* with query", async () => {
    const server = await createTestServer();

    const client = await createConnection(server);

    const response = await client.callTool({
      name: "search_cy_fe_articles",
      arguments: {
        query: "Form Control",
        limit: 2,
        offset: 0,
      },
    });

    console.log(response.content);

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
  });
});
