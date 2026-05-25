import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getEnvironmentInfo } from "./tools/environment.js";

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

server.registerTool(
  "get_environment_info",
  {
    title: "Get Environment Info",
    description: "Read safe local environment information for the XAMPP WordPress MCP server.",
    inputSchema: {},
  },
  async () => {
    const info = await getEnvironmentInfo();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(info, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);