# Deep Research Assistant

An advanced AI-powered research tool that conducts thorough research on any topic, delivering factual, well-cited, and coherent answers in a conversational format.

## Overview

Deep Research Assistant (DRA) is designed to transform how users gather information. Unlike traditional search engines that return a list of links, DRA:

- Actively searches for information from diverse, authoritative sources
- Analyzes and verifies content for factual accuracy
- Synthesizes findings into coherent, well-structured responses
- Maintains conversation context to support follow-up questions
- Properly cites all sources for verification

## Features

- Comprehensive multi-source research capabilities
- Factual accuracy with proper citations
- Contextual memory for follow-up questions
- Balanced presentation of different perspectives
- Conversational interface

## Prerequisites

- [Deno](https://deno.com/) 1.38 or higher
- API keys for:
  - OpenAI (or compatible LLM provider)
  - Tavily

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ncolesummers/deep-researcher.git
cd deep-researcher
```

2. Create a `.env` file based on the provided example:
```bash
cp .env.example .env
```

3. Edit the `.env` file to add your API keys.

## Quick Start

1. Set up your environment variables:
```bash
# .env file
OPENAI_API_KEY=your_openai_key_here
TAVILY_API_KEY=your_tavily_key_here
```

2. Run the development server:
```bash
deno task dev
```

3. Example usage:
```typescript
// Example code showing basic usage will be added here
```

## Documentation

For detailed documentation, see the [docs](/docs) directory:

- [Product Requirements Document](/docs/PRD.md)
- API Reference (coming soon)
- Tutorials (coming soon)

## Development

```bash
# Run the development server with auto-reload
deno task dev

# Run tests
deno test
```

## Contributing

We welcome contributions to the Deep Research Assistant! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. 