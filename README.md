# Deep Researcher

An advanced AI-powered tool designed to conduct thorough research in response to user queries. 
This project uses Deno, TypeScript, and OpenAI to create a conversational AI assistant 
that performs comprehensive research and delivers factual, well-cited answers.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed (version 1.30.0 or later)
- OpenAI API key
- Tavily API key (for future implementation)

### Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
# Edit .env to add your API keys
```

3. Run the Hello World example:

```bash
deno run --allow-net --allow-env main.ts
```

## Features

- Simplified workflow demonstration for a research assistant
- OpenAI integration for natural language understanding and generation
- Future implementation will include:
  - Full LangGraph workflow for orchestration
  - Tavily search integration for retrieving information from the web

## Hello World Example

The current implementation includes a simple "Hello World" example that:

1. Takes a user query
2. Simulates a research step (would use Tavily in a full implementation)
3. Generates a response using OpenAI

This demonstrates the basic workflow that will be expanded to implement the full 
Deep Researcher functionality as described in the PRD.

### Note on LangGraph

While the project is designed to eventually use LangGraph for orchestration, the current 
implementation uses a simplified approach to demonstrate the core concepts. Future versions 
will incorporate LangGraph for more sophisticated workflow management.

## Running Tests

```bash
# Run the basic tests (add function)
deno test main_test.ts

# Run the researcher tests (requires API keys)
deno test researcher_test.ts
```

Note: The researcher tests are currently set to `ignore: true` because they require 
API keys. Edit the test file to enable them after setting up your environment.

## Project Structure

- `main.ts` - Entry point with basic example
- `researcher.ts` - Research assistant implementation
- `main_test.ts` - Basic tests
- `researcher_test.ts` - Tests for the researcher functionality

## License

MIT

## Author

Created by ncolesummers 