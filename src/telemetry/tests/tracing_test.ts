import { assertEquals, assertExists } from '@std/assert';
import { createTracedFunction, createSpanManager } from '../tracing.ts';

/**
 * Tests for the tracing module
 *
 * Note: These tests verify the API surface and basic functionality
 * without mocking the OpenTelemetry API, which is difficult to mock
 * in the test environment.
 */

Deno.test('Tracing - createTracedFunction returns a function', () => {
  // Create a traced function
  const testFn = async (arg1: string, arg2: number) => {
    return `${arg1}-${arg2}`;
  };

  const tracedFn = createTracedFunction('test-operation', testFn);

  // Verify it's a function
  assertEquals(typeof tracedFn, 'function');
});

Deno.test(
  'Tracing - createTracedFunction preserves function behavior',
  async () => {
    // Create a traced function
    const testFn = async (arg1: string, arg2: number) => {
      return `${arg1}-${arg2}`;
    };

    const tracedFn = createTracedFunction('test-operation', testFn);

    // Call the traced function
    const result = await tracedFn('hello', 42);

    // Verify result is the same as the original function
    assertEquals(result, 'hello-42');
  }
);

Deno.test(
  'Tracing - createTracedFunction preserves error behavior',
  async () => {
    // Create a traced function that throws
    const error = new Error('Test error');
    const testFn = async () => {
      throw error;
    };

    const tracedFn = createTracedFunction('error-operation', testFn);

    // Call and expect error
    let caughtError: Error | undefined;
    try {
      await tracedFn();
    } catch (e) {
      caughtError = e as Error;
    }

    // Verify error was thrown and is the same
    assertExists(caughtError);
    assertEquals(caughtError, error);
  }
);

Deno.test('Tracing - createSpanManager returns expected interface', () => {
  // Create a span manager
  const spanManager = createSpanManager('test-span');

  // Verify it has the expected methods
  assertEquals(typeof spanManager.start, 'function');
  assertEquals(typeof spanManager.end, 'function');
  assertEquals(typeof spanManager.addAttribute, 'function');
  assertEquals(typeof spanManager.addAttributes, 'function');
  assertEquals(typeof spanManager.addEvent, 'function');
  assertEquals(typeof spanManager.recordError, 'function');
});
