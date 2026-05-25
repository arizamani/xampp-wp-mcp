# XAMPP WordPress MCP Server

A local MCP (Model Context Protocol) server that automates WordPress setup on XAMPP with safe, controlled automation tools.

## 🎯 Goal

Build an intelligent automation assistant that can:

1. Create project folders inside `htdocs`
2. Create MySQL/MariaDB databases
3. Prepare fresh WordPress installations
4. Handle Duplicator-based restore workflows
5. Generate safe installation instructions
6. **Never expose unrestricted shell access**

## 📚 Learning Objectives

This is both a practical tool and a learning project. You'll understand:

- **MCP Fundamentals**: How servers expose tools to AI clients
- **Safe Automation**: Designing tool boundaries and validation
- **Local vs Remote**: Differences between local and API-based automation
- **Node.js Filesystem**: Controlled file operations and system commands
- **WordPress Workflows**: WP-CLI, wp-config.php, and installation automation
- **Developer Tools**: Building real, production-safe automation utilities

## 🏗️ Architecture

```
AI Client (Claude, etc.)
  |
  | calls MCP tools via stdio/HTTP
  v
Local MCP Server (Node.js/TypeScript)
  |
  ├── File Tools (create folders, copy backups, download WordPress)
  ├── Database Tools (MySQL/MariaDB automation)
  ├── WordPress Tools (wp-config generation, WP-CLI integration)
  └── Safety Layer (path validation, project name checks, dry-run mode)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- XAMPP with Apache and MySQL/MariaDB
- TypeScript knowledge (helpful but not required)

### Installation

```bash
# Create and navigate to project
mkdir xampp-wp-mcp
cd xampp-wp-mcp

# Initialize npm project
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod
npm install -D typescript tsx @types/node
```

### Verify Installation

```bash
npx tsx --version
```

## 📋 Learning Phases

### Phase 1: Understand MCP
Learn MCP concepts: servers, clients, tools, resources, prompts, and transports.

### Phase 2: Minimal MCP Server
Build a Node.js server with a single `ping` tool to prove it works.

### Phase 3: Safe Filesystem Automation
Add tools:
- `create_project_folder`
- `list_allowed_backups`
- `copy_duplicator_files`

### Phase 4: Database Automation
Add tools:
- `create_mysql_database`
- `check_mysql_connection`
- `check_database_exists`

### Phase 5: Fresh WordPress Setup
Add tools:
- `download_wordpress`
- `extract_wordpress`
- `create_wp_config`

### Phase 6: Duplicator Workflow
Add tools:
- `prepare_duplicator_restore`

### Phase 7: Safety & Logging
Add:
- Dry-run mode
- Detailed logging
- Input validation
- Config file support
- Destructive action confirmations

## 🛡️ Safety First

This project prioritizes safety:

- ✅ **Allowed paths only** - All file operations restricted to configured directories
- ✅ **Project name validation** - Prevent injection and invalid names
- ✅ **No unrestricted shell access** - No `execute_shell` or `run_any_command` tools
- ✅ **Dry-run support** - Preview actions before execution
- ✅ **Detailed logging** - Full audit trail of operations

## 📦 Technology Stack

### Core
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **@modelcontextprotocol/sdk** - MCP framework
- **Zod** - Input validation

### Optional (Later Phases)
- **WP-CLI** - WordPress command-line interface
- **mysql2** - Database connections
- **execa** - Safe command execution
- **fs-extra** - Enhanced file operations

## 📖 Documentation

Planned documentation files:

```
docs/
├── 01-mcp-concepts.md          # What is MCP?
├── 02-security-model.md         # Safety design principles
├── 03-tool-design.md            # How tools are designed
├── 04-xampp-wordpress-workflow.md  # WordPress on XAMPP
├── 05-database-automation.md    # MySQL/MariaDB automation
├── 06-wp-cli-workflow.md        # WP-CLI integration
└── 07-duplicator-restore-workflow.md  # Duplicator automation
```

## 🗺️ Current Status

- [x] Learning roadmap defined
- [x] Architecture documented
- [ ] Phase 1: MCP fundamentals documentation
- [ ] Phase 2: Minimal MCP server scaffold
- [ ] Phase 3+: Progressive feature additions

## 💡 Next Steps

1. Create initial project structure
2. Set up TypeScript and development tools
3. Build minimal MCP server with `ping` tool
4. Expand with filesystem and database tools
5. Add comprehensive documentation
6. Test with Claude or other MCP clients

## 🤝 Contributing

This is a learning project. Contributions, feedback, and improvements are welcome!

## 📝 License

MIT

---

**Built with 🚀 for safe, intelligent WordPress automation on local XAMPP environments.**
