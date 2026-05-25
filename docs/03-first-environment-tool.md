# 03 — First Real Tool: `get_environment_info`

## Goal of This Step

Now we create our first real MCP tool.

The tool will be:

```txt
get_environment_info
```

This tool will safely read basic information from your local environment.

It will not create files.
It will not create databases.
It will not install WordPress.
It will not run dangerous shell commands.

It only answers:

```txt
Is my local development environment configured correctly?
```

---

## 1. Why This Tool Matters

Before an automation tool changes anything, it should inspect the environment.

For your XAMPP WordPress workflow, we need to know:

```txt
Where is htdocs?
Where are backups stored?
Does the htdocs folder exist?
Does the backup folder exist?
Which operating system is this?
Which Node.js version is running?
```

This is similar to a doctor checking basic vital signs before treatment.

We do not start by creating WordPress sites.
We start by checking if the system is ready.

---

## 2. What This Tool Should Return

Example output:

```json
{
  "platform": "win32",
  "nodeVersion": "v22.0.0",
  "xamppRoot": "C:/xampp",
  "htdocsPath": "C:/xampp/htdocs",
  "backupsPath": "D:/wp-backups",
  "paths": {
    "xamppRootExists": true,
    "htdocsExists": true,
    "backupsPathExists": true
  }
}
```

This information helps the AI assistant decide the next safe action.

---

## 3. Add Configuration File

Create this file:

```txt
src/config.ts
```

Add:

```ts
export const appConfig = {
  xamppRoot: process.env.XAMPP_ROOT ?? "C:/xampp",
  htdocsPath: process.env.XAMPP_HTDOCS ?? "C:/xampp/htdocs",
  backupsPath: process.env.WP_BACKUPS_PATH ?? "D:/wp-backups",
};
```

## Why use environment variables?

Because your paths may change later.

For example, on another computer XAMPP may be installed here:

```txt
D:/xampp
```

Instead of changing the code, you can later set:

```bash
XAMPP_ROOT=D:/xampp
XAMPP_HTDOCS=D:/xampp/htdocs
WP_BACKUPS_PATH=E:/wordpress-backups
```

This keeps code flexible.

---

## 4. Create the Environment Tool File

Create:

```txt
src/tools/environment.ts
```

Add:

```ts
import fs from "fs-extra";
import { appConfig } from "../config.js";

export async function getEnvironmentInfo() {
  const [xamppRootExists, htdocsExists, backupsPathExists] = await Promise.all([
    fs.pathExists(appConfig.xamppRoot),
    fs.pathExists(appConfig.htdocsPath),
    fs.pathExists(appConfig.backupsPath),
  ]);

  return {
    platform: process.platform,
    nodeVersion: process.version,
    xamppRoot: appConfig.xamppRoot,
    htdocsPath: appConfig.htdocsPath,
    backupsPath: appConfig.backupsPath,
    paths: {
      xamppRootExists,
      htdocsExists,
      backupsPathExists,
    },
  };
}
```

## What this code does

### `fs.pathExists(...)`

Checks if a path exists.

It returns `true` or `false`.

Unlike some lower-level filesystem methods, it is convenient and easy to read.

### `Promise.all(...)`

Runs multiple async checks in parallel.

Instead of checking paths one by one:

```txt
check xampp
then check htdocs
then check backups
```

It checks them together:

```txt
check xampp + htdocs + backups at the same time
```

This is cleaner and faster.

---

## 5. Register the Tool in `src/index.ts`

Update `src/index.ts`:

```ts
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
    description:
      "Read safe local environment information for the XAMPP WordPress MCP server.",
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
```

---

## 6. Build the Project

Run:

```bash
npm run build
```

If everything is correct, TypeScript should compile without errors.

Then run:

```bash
npm run dev
```

Again, because this is a stdio MCP server, it may wait silently.

That is normal.

---

## 7. How To Think About This Tool

This tool is a **read-only diagnostic tool**.

That means:

```txt
Input: none
Action: inspect environment
Output: structured environment report
Side effect: none
```

This is the safest kind of tool.

When designing MCP tools, always ask:

```txt
Does this tool read something?
Does this tool change something?
Could this tool damage something?
Can this tool be limited?
Can input be validated?
```

---

## 8. Why We Return JSON as Text

MCP tool responses can return content blocks.

For a simple first version, we return JSON formatted as text:

```ts
text: JSON.stringify(info, null, 2);
```

This is readable for both humans and AI clients.

Later, we can improve this pattern with helper functions.

---

## 9. Expected Result

When the MCP client calls:

```txt
get_environment_info
```

It should receive something like:

```json
{
  "platform": "win32",
  "nodeVersion": "v22.0.0",
  "xamppRoot": "C:/xampp",
  "htdocsPath": "C:/xampp/htdocs",
  "backupsPath": "D:/wp-backups",
  "paths": {
    "xamppRootExists": true,
    "htdocsExists": true,
    "backupsPathExists": false
  }
}
```

If `backupsPathExists` is false, it does not mean the server is broken.

It only means that folder does not currently exist.

Later we can create a safe tool for creating or configuring backup folders.

---

## 10. What We Learned

In this step we learned:

- how to separate config from logic
- how to create a read-only MCP tool
- how to inspect local paths safely
- how to register a second MCP tool
- why diagnostic tools should come before automation tools
- how `Promise.all` helps with parallel async checks
- how to return structured information from a tool

---

## 11. Next Step

Next we will add validation utilities.

The next important file will be:

```txt
src/utils/validation.ts
```

We need validation before creating folders or databases.

The first validator will check project/site names.

Examples of valid names:

```txt
client-demo
agency-test
shop-01
```

Examples of invalid names:

```txt
../danger
client demo
C:/Windows
my/site
site; delete something
```

This is one of the most important security steps in the whole project.
