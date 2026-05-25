import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "xampp-wp-mcp",
  version: "0.1.0",
});

server.registerTool(
  "ping",
  {
    title: "Ping",
    description: "Test whether the XAMPP WordPress MCP server is running.",
    inputSchema: {},
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "pong - XAMPP WordPress MCP server is running",
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);