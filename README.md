# Deep Researcher

An advanced AI-powered tool designed to conduct thorough research in response to user queries. 
This project uses Deno, TypeScript, and OpenAI to create a conversational AI assistant 
that performs comprehensive research and delivers factual, well-cited answers.

## Project Structure

The codebase is organized as follows:

```
src/
├── core/                      # Core application logic
│   ├── researcher.ts          # Main researcher implementation
│   └── tests/                 # Tests for core components
│       └── researcher_test.ts
├── services/                  # External service integrations
│   └── tavily/                # Tavily search integration
│       ├── tavily_search.ts   # Tavily search implementation
│       ├── examples/          # Example usage
│       │   └── tavily_search_example.ts
│       └── tests/             # Tests for Tavily integration
│           └── tavily_search_test.ts
├── main.ts                    # Main application entry point
└── tests/                     # Top-level tests
    └── main_test.ts
```

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed (version 1.30.0 or later)
- OpenAI API key
- Tavily API key (for using search functionality)

### Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
# Edit .env to add your API keys
```

3. Run the application:

```bash
deno task dev
```

## Features

- Simplified workflow demonstration for a research assistant
- OpenAI integration for natural language understanding and generation
- Tavily search integration for retrieving information from the web
- Future implementations will include full LangGraph workflow for orchestration

## Examples

### Basic Researcher

```bash
deno task dev
```

### Tavily Search

```bash
deno task tavily:example "Your search query"
```

## Running Tests

```bash
# Run all tests
deno task test

# Run tests in watch mode
deno task test:watch

# Run only the core tests
deno task test:core

# Run only the Tavily search tests
deno task test:tavily
```

Note: Some tests are set to `ignore: true` because they require API keys. Edit the test files to enable them after setting up your environment.

## Development Tasks

The project includes several Deno tasks to streamline development:

```bash
# Start the development server with auto-reload
deno task dev

# Run all tests
deno task test

# Run tests in watch mode
deno task test:watch

# Run only the core tests
deno task test:core

# Run only the Tavily search tests
deno task test:tavily

# Run the Tavily search example
deno task tavily:example "Your search query"

# Run the linter
deno task lint

# Format code
deno task fmt

# Check formatting
deno task fmt:check

# Type check
deno task check
```

## License

MIT

## Author

Created by ncolesummers 