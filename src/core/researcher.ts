import { ChatOpenAI } from 'npm:@langchain/openai';

// Define a simple research state interface
interface ResearchState {
  question: string;
  research_summary?: string;
  answer?: string;
}

/**
 * A simple "Hello World" example for the Deep Researcher application.
 * This demonstrates the basic flow of:
 * 1. Taking a user query
 * 2. Searching for information (simulated here)
 * 3. Generating a response
 *
 * Note: This is a simplified version that shows the concept without using the full
 * LangGraph complexity, which requires more detailed configuration.
 */
export async function simpleResearcher(query: string): Promise<string> {
  console.log('Starting research on query:', query);

  // Initialize the state
  const state: ResearchState = {
    question: query,
  };

  // Initialize LLM
  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  // Step 1: Research node (simulate research)
  console.log('Researching information for:', state.question);
  state.research_summary = `Found some interesting information about: ${state.question}`;

  // Step 2: Answer node (use LLM to generate answer)
  console.log('Generating answer based on research...');

  try {
    const response = await llm.invoke([
      ['system', 'You are a helpful research assistant.'],
      [
        'human',
        `Question: ${state.question}\nResearch: ${state.research_summary}\nPlease provide a concise answer.`,
      ],
    ]);

    state.answer = response.content as string;
  } catch (error) {
    console.error('Error generating answer:', error);
    state.answer =
      'Sorry, I encountered an error while generating your answer.';
  }

  return state.answer || "Sorry, I couldn't find an answer.";
}

// Run the example if this module is executed directly
if (import.meta.main) {
  const answer = await simpleResearcher('What is LangGraph?');
  console.log('\nFinal Answer:', answer);
}
