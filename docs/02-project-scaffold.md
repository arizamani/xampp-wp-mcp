# 02 — Project Scaffold for the XAMPP WordPress MCP Server

## Goal of This Step

In this step we create the real project structure for our local MCP server.

By the end of this step, we want a minimal TypeScript project that can later expose MCP tools such as:

```txt
get_environment_info
check_xampp_paths
create_project_folder
```

We are not automating XAMPP yet. First, we build a clean foundation.

---

## 1. Create the Project Folder

Open a terminal in the place where you keep development projects.

For example:

```bash
mkdir xampp-wp-mcp
cd xampp-wp-mcp
```

Recommended location examples:

```txt
D:/projects/xampp-wp-mcp
C:/Users/YourName/projects/xampp-wp-mcp
```

Avoid putting this MCP project itself inside:

```txt
C:/xampp/htdocs
```

Why?

Because this MCP server is a developer tool, not a WordPress website.

---

## 2. Initialize npm

Run:

```bash
npm init -y
```

This creates:

```txt
package.json
```

The `package.json` file describes the Node.js project, dependencies, scripts, name, version, and entry points.

---

## 3. Install Runtime Dependencies

Run:

```bash
npm install @modelcontextprotocol/sdk zod fs-extra execa
```

### Why these packages?

#### `@modelcontextprotocol/sdk`

The official TypeScript SDK for building MCP servers and clients.

We use it to create the server, register tools, and connect using stdio.

#### `zod`

A validation library.

We use it to validate tool input.

Example:

```ts
siteName must be a string
siteName must not contain spaces
siteName must not contain ../
```

#### `fs-extra`

A more convenient filesystem library than Node's default `fs` module.

We use it for actions like:

```txt
check if folder exists
create folder
copy files
ensure directory exists
```

#### `execa`

A safer and cleaner way to run controlled external commands.

Later we may use it for controlled commands such as:

```txt
mysql.exe
wp-cli.phar
```

We will not use it for unrestricted commands.

---

## 4. Install Development Dependencies

Run:

```bash
npm install -D typescript tsx @types/node @types/fs-extra
```

### Why these packages?

#### `typescript`

Adds TypeScript support.

#### `tsx`

Lets us run TypeScript files directly during development without manually compiling first.

#### `@types/node`

Provides TypeScript types for Node.js APIs.

#### `@types/fs-extra`

Provides TypeScript types for `fs-extra`.

---

## 5. Create TypeScript Config

Run:

```bash
npx tsc --init
```

Then update `tsconfig.json` to this simpler version:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

---

## 6. Update `package.json`

Edit `package.json` and add:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Do not remove the dependencies section that npm generated.

Your final `package.json` will include name, version, scripts, dependencies, and devDependencies.

---

## 7. Create the Folder Structure

Run:

```bash
mkdir src
mkdir src/tools
mkdir src/utils
mkdir docs
```

Create these files:

```txt
src/index.ts
src/config.ts
src/tools/environment.ts
src/utils/validation.ts
README.md
.gitignore
```

On Windows PowerShell, you can run:

```powershell
New-Item src/index.ts -ItemType File
New-Item src/config.ts -ItemType File
New-Item src/tools/environment.ts -ItemType File
New-Item src/utils/validation.ts -ItemType File
New-Item README.md -ItemType File
New-Item .gitignore -ItemType File
```

---

## 8. Add `.gitignore`

Inside `.gitignore`:

```gitignore
node_modules
dist
.env
*.log
.DS_Store
```

Why `.env`?

Later we may store local paths or database configuration there.

We should not commit secrets or machine-specific configuration.

---

## 9. First Minimal MCP Server

In `src/index.ts`, add:

```ts
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
```

This gives us the first safe tool:

```txt
ping
```

It does not touch files, databases, or XAMPP.

It only proves that the MCP server starts correctly.

---

## 10. Run the Server Locally

Run:

```bash
npm run dev
```

Important: an MCP stdio server usually waits silently because it expects an MCP client to communicate with it.

So if it appears to do nothing, that does not automatically mean it is broken.

---

## 11. Build the Project

Run:

```bash
npm run build
```

If there are no TypeScript errors, it should create:

```txt
dist/index.js
```

Then run:

```bash
npm start
```

Again, it may wait silently because it is a stdio server.

---

## 12. What We Learned in This Step

We learned:

- how to initialize a Node.js project
- why this project should not live inside `htdocs`
- what runtime dependencies we need
- what development dependencies we need
- why TypeScript helps with MCP tool safety
- why `zod` is useful for validation
- why stdio servers may appear silent
- how to create the first minimal MCP tool

---

## 13. Next Step

Next we will create a real environment tool:

```txt
get_environment_info
```

It will return information like:

```txt
platform
node version
configured htdocs path
configured backup path
whether paths exist
```

This will be our first tool that reads local environment information safely.
