import { spy } from 'https://deno.land/std/testing/mock.ts';
import { assertEquals } from '@std/assert';
import { setupOpenTelemetry } from '../setup.ts';

Deno.test('Setup - setupOpenTelemetry logs instructions', () => {
  // Mock console.log to prevent actual logging during tests
  const originalConsoleLog = console.log;
  const logSpy = spy();
  console.log = logSpy;

  try {
    // Call the setup function
    setupOpenTelemetry();

    // Verify it logs the expected messages
    assertEquals(logSpy.calls.length, 2);
    logSpy.calls.forEach(call => {
      const message = call.args[0];
      const isInstructions =
        message.includes('OpenTelemetry') || message.includes('unstable-otel');
      assertEquals(isInstructions, true);
    });
  } finally {
    // Restore original console.log
    console.log = originalConsoleLog;
  }
});
