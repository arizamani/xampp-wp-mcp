# 01 — MCP Concepts for Our XAMPP WordPress Automation Project

## 1. What Is MCP?

MCP means **Model Context Protocol**.

Think of it as a standard way for an AI assistant to communicate with external tools, files, databases, services, or local applications.

Without MCP, every AI app needs a custom integration for every tool:

```txt
AI App A -> custom WordPress integration
AI App A -> custom filesystem integration
AI App A -> custom database integration

AI App B -> another custom WordPress integration
AI App B -> another custom filesystem integration
AI App B -> another database integration
```

With MCP, we create one MCP server:

```txt
AI Client -> MCP Server -> Local system / files / database / APIs
```

The MCP server exposes controlled capabilities to the AI client.

For our project, the MCP server will expose safe local WordPress/XAMPP actions.

---

## 2. The Main Pieces

### 2.1 MCP Client

The **MCP client** is the application that talks to the MCP server.

Examples:

```txt
ChatGPT Desktop
Claude Desktop
Cursor
VS Code AI extension
Windsurf
Custom AI app
```

The client does not directly modify your computer. Instead, it asks the MCP server to run specific tools.

---

### 2.2 MCP Server

The **MCP server** is the program we build.

In our project, this will be a local Node.js/TypeScript application.

Its job is to expose safe tools like:

```txt
create_project_folder
create_mysql_database
download_wordpress
prepare_duplicator_restore
```

The MCP server is the boundary between the AI assistant and your local machine.

That boundary is very important.

The AI should not receive unlimited access to your system. It should only receive access to carefully designed tools.

---

### 2.3 Tool

A **tool** is an action the AI can ask the MCP server to perform.

Examples for our project:

```txt
create_project_folder(siteName)
create_mysql_database(databaseName)
copy_duplicator_files(siteName, backupName)
download_fresh_wordpress(siteName)
```

Tools usually change something or perform an action.

They are similar to functions in programming.

Example mental model:

```ts
function createProjectFolder(siteName: string) {
  // validate name
  // create C:/xampp/htdocs/siteName
  // return result
}
```

A good MCP tool should:

- have a clear name
- accept structured input
- validate input
- return structured output
- do one job well
- avoid dangerous side effects

---

### 2.4 Resource

A **resource** is information the AI can read.

Resources are usually not actions. They are more like readable data.

Examples:

```txt
xampp://config
xampp://sites
xampp://backups
project://current-settings
```

Possible resources for our project:

```txt
List of local sites
List of available Duplicator backups
Current XAMPP path configuration
Project logs
```

A resource answers questions like:

```txt
What local WordPress sites exist?
Which backups are available?
What is the configured htdocs path?
```

---

### 2.5 Prompt

A **prompt** is a reusable instruction template exposed by the MCP server.

For example, later we may create a prompt like:

```txt
Create a fresh local WordPress site
```

or:

```txt
Restore a Duplicator backup into XAMPP
```

Prompts are useful for repeated workflows, but we do not need them at the beginning.

Our first focus should be tools.

---

### 2.6 Transport

The **transport** is how the MCP client and MCP server communicate.

Common transports:

```txt
stdio
HTTP / Streamable HTTP
```

For local tools, **stdio** is common.

With stdio, the client starts the MCP server as a local process and communicates with it using standard input/output.

Mental model:

```txt
AI Client
  |
  | starts local Node.js process
  v
MCP Server over stdio
```

For our first version, stdio is the best choice because:

- it is local
- it is simple
- it does not need a web server
- it fits desktop AI client integration

---

## 3. What Our MCP Server Should Do

Our server should automate this local workflow:

```txt
1. Receive site name
2. Validate site name
3. Create folder in htdocs
4. Create database
5. If fresh WordPress:
   - download WordPress
   - extract files
   - create wp-config.php
6. If Duplicator backup:
   - copy installer.php
   - copy archive file
   - provide local installer URL
```

Example result:

```txt
Site name: client-demo
Folder: C:/xampp/htdocs/client-demo
Database: client_demo
URL: http://localhost/client-demo
```

---

## 4. What Our MCP Server Should NOT Do

We should avoid tools like:

```txt
run_any_command(command)
execute_shell(command)
delete_any_file(path)
write_any_file(path, content)
```

These are dangerous because the AI could accidentally or maliciously run destructive commands.

Instead of this:

```txt
run_any_command("mysql -u root -e 'CREATE DATABASE test'")
```

We design this:

```txt
create_mysql_database({ databaseName: "test" })
```

This gives us control.

The tool can validate:

- database name
- allowed characters
- MySQL path
- whether the database already exists
- whether the command is safe

---

## 5. Our First Safe Tool List

The first version should include only simple tools:

```txt
get_environment_info
validate_project_name
check_xampp_paths
create_project_folder
```

Only after those are stable should we add:

```txt
create_mysql_database
download_wordpress
prepare_duplicator_restore
```

---

## 6. Project Structure Preview

Recommended structure:

```txt
xampp-wp-mcp/
  package.json
  tsconfig.json
  README.md
  .gitignore
  src/
    index.ts
    config.ts
    tools/
      environment.ts
      project-folder.ts
      database.ts
      wordpress.ts
      duplicator.ts
    utils/
      validation.ts
      paths.ts
      result.ts
  docs/
    01-mcp-concepts.md
    02-security-model.md
    03-tool-design.md
    04-xampp-wordpress-workflow.md
```

---

## 7. Important Design Principle

The AI should not control your computer directly.

The AI should request safe business-level actions:

```txt
Create a WordPress site
Create a database
Prepare a Duplicator restore
```

The MCP server decides how to perform those actions safely.

This is the key idea of our whole project.

---

## 8. Next Step

After understanding these concepts, we will scaffold the actual project:

```bash
mkdir xampp-wp-mcp
cd xampp-wp-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript tsx @types/node
```

Then we will create:

```txt
src/index.ts
src/config.ts
src/tools/environment.ts
```

The first working MCP tool will be:

```txt
get_environment_info
```
