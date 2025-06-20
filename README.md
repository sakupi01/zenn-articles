[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/sakupi01-zenn-articles-badge.png)](https://mseep.ai/app/sakupi01-zenn-articles)

# @sakupi01/zenn-articles

[![npm version](https://badge.fury.io/js/@sakupi01%2Fzenn-articles.svg)](https://badge.fury.io/js/@sakupi01%2Fzenn-articles)
[![Release](https://github.com/sakupi01/zenn-articles/actions/workflows/release.yml/badge.svg)](https://github.com/sakupi01/zenn-articles/actions/workflows/release.yml)
[![Deploy](https://github.com/sakupi01/zenn-articles/actions/workflows/deploy.yml/badge.svg)](https://github.com/sakupi01/zenn-articles/actions/workflows/deploy.yml)
[![Publish Docker image](https://github.com/sakupi01/zenn-articles/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/sakupi01/zenn-articles/actions/workflows/docker-publish.yml)

An MCP Server for blog search functionality!

Available as Local Package and Remote Server.

- Docker Image: [sakupi/zenn-articles](https://hub.docker.com/r/sakupi/zenn-articles)
- Package: [@sakupi01/zenn-articles](https://www.npmjs.com/package/@sakupi01/zenn-articles)
- Remote Server: [https://mcp.sakupi01.com/mcp](https://zenn-mcp.sakupi01.com/mcp)

## Usage

### Using in MCP Client

You can use @sakupi01/zenn-articles MCP server in MCP Client with the following methods:

#### Use as Local MCP Server

##### Option 1: Use Docker Image

```bash
# Pull the Docker image from Docker Hub
docker pull sakupi/zenn-articles
```

To use Docker Image, add the following style of setting to your Host:.
For example, `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "@sakupi01.com/mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--network=host",
        "sakupi/zenn-articles"
      ]
    }
  }
}
```

##### Option 2: Use npx

```bash
# Run the MCP server directly using npx
npx @sakupi01/zenn-articles
```

Add the following settings to your MCP client configuration:

```json
{
  "mcpServers": {
    "zenn-articles": {
      "command": "npx",
      "args": [
        "@sakupi01/zenn-articles"
      ]
    }
  }
}
```

### Running the MCP Server Locally

```typescript
import { runServer } from "@sakupi01/zenn-articles/remote";

// Start server with default settings (port 8000)
runServer();
```

Then, Add `http://localhost:8000/mcp` as the server URL to your MCP Client.

### Using the Remote MCP Server

You can use the already deployed MCP server as an API endpoint:

```json
"mcp": {
  "servers": {
    "sakupi01-mcp": {
      "type": "http",
      "url": "https://zenn-mcp.sakupi01.com/mcp"
    }
  }
}
```

## Available Tools

### Blog Search Tool (`search_cy_fe_articles`)

Search blog posts by title, description, URL, tags, and content.  
Multiple keywords separated by spaces are treated as OR conditions.

#### Parameters

- `query`: Search query (required, 1-100 characters)
- `limit`: Maximum number of results to return (optional, default: 10, max: 100)
- `offset`: Result offset (optional, default: 0)
- `order`: Sort order (optional, "desc" (newest first) or "asc" (oldest first), default: "desc")

#### Example Response

```json
{
  "total": 1,
  "offset": 0,
  "limit": 2,
  "order": "desc",
  "query": {
    "original": "Form Control",
    "keywords": [
      "form",
      "control"
    ],
    "exactPhrases": []
  },
  "results": [
    {
      "title": "Form Control Styling Level 1 など: Cybozu Frontend Weekly (2025-03-25号)",
      "pubDate": "2025-03-28T03:00:00.000Z",
      "description": "サイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。",
      "link": "https://zenn.dev/cybozu_frontend/articles/frontend_weekly_example",
      "content": "こんにちは！サイボウズ株式会社フロントエンドエンジニアの[saku (@sakupi01)](https://x.com/sakupi01)です。\n\n# はじめに\n\nサイボウズ社内では毎週火曜日にFrontend Weeklyと題し「一週間の間にあったフロントエンドニュースを共有する会」を開催しています。\n\n今回は、2025/03/25のFrontend Weeklyで取り上げた記事や話題を紹介します。",
      "tags": [
        "CybozuFrontendWeekly",
        "frontend"
      ],
      "score": 10
    }
  ]
}
```

## Available Prompts

### Frontend Weekly Content Generation (`fe-weekly`)

Generate frontend weekly content summaries for given URLs in the style of Cybozu Frontend Weekly.

#### Parameters

- `urls`: A list of URLs to generate frontend weekly content for

#### Example Usage

```bash
# In Claude Desktop
@zenn-articles fe-weekly urls="https://example.com/article1\nhttps://example.com/article2"
```

The prompt uses the blog search tool internally to find related content and provides consistent, well-formatted summaries with:

- Brief description (about 2-3 lines)
- Context about the technology or feature
- Future implications or considerations
- Follows Cybozu Frontend Weekly style guidelines

## Running Tests

Install dependencies and run tests:

```bash
pnpm test
```

## Changelog

See the [Releases](https://github.com/sakupi01/zenn-articles/releases) page.

## License

Released under the MIT License. See the [LICENSE](./LICENSE) file for details.
