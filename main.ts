import { simpleResearcher } from './researcher.ts';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log('=== Deep Researcher Hello World ===');
  console.log('This example demonstrates a simple research workflow:');
  console.log('1. Take a user query');
  console.log('2. Perform research (simulated)');
  console.log('3. Generate answer using OpenAI\n');

  const query = 'What is LangGraph?';
  console.log(`Researching: "${query}"`);

  simpleResearcher(query)
    .then(result => {
      console.log('\nResearch Result:');
      console.log(result);
      console.log(
        '\nNote: This is a simplified version of the Deep Researcher.'
      );
      console.log(
        'A more complex version would use LangGraph for orchestration.'
      );
    })
    .catch(error => {
      console.error('Error in research:', error);
    });
}
