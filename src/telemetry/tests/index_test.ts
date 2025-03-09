import { spy } from 'https://deno.land/std/testing/mock.ts';
import { assertEquals, assertExists } from '@std/assert';
import { Logger } from '../logger.ts';

// At the top of your test file
declare global {
  interface GlobalThis {
    import: (specifier: string) => Promise<unknown>;
  }
}

// Mock the langchain config module
// deno-lint-ignore no-explicit-any
(globalThis as any).mockLangchainConfig = {
  verifyLangSmithEnv: () => false,
  langsmithSetupInstructions: () => 'Mock instructions',
};

// Mock the import in index.ts
// This is a hack for testing purposes
const originalImport = globalThis.import;
// deno-lint-ignore no-explicit-any
(globalThis as any).import = async (specifier: string) => {
  if (specifier.includes('langchain/config.ts')) {
    return (globalThis as any).mockLangchainConfig;
  }
  return originalImport(specifier);
};

// Import the module after mocking
import { initializeTelemetry } from '../index.ts';

// Mock console to prevent actual logging during tests
const mockConsole = {
  log: spy(),
  warn: spy(),
  error: spy(),
};

// Mock Deno namespace
const originalDeno = {
  args: Deno.args,
  env: {
    get: Deno.env.get,
  },
};

Deno.test({
  name: 'Telemetry - initializeTelemetry initializes telemetry system',
  fn: () => {
    // Save original console functions
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    // Replace console functions with mocks
    Object.assign(console, mockConsole);

    // Mock Deno object
    // deno-lint-ignore no-explicit-any
    (Deno as any).args = [];
    // deno-lint-ignore no-explicit-any
    (Deno as any).env = {
      get: (key: string) => (key === 'OTEL_DENO' ? 'false' : null),
    };

    try {
      // Call the initialization function
      const telemetry = initializeTelemetry();

      // Check that the function returns the expected interface
      assertExists(telemetry);
      assertExists(telemetry.getLogger);

      // Test creating a logger
      const logger = telemetry.getLogger('test-component');
      assertExists(logger);
      assertEquals(logger instanceof Logger, true);

      // Verify warning logs were made about incomplete configuration
      const warnings = mockConsole.warn.calls.filter(
        call =>
          typeof call.args[0] === 'string' &&
          call.args[0].includes('not fully configured')
      );
      assertEquals(warnings.length > 0, true);
    } finally {
      // Restore original console functions
      Object.assign(console, originalConsole);

      // Restore original Deno object
      Object.assign(Deno, originalDeno);

      // Restore original import
      // deno-lint-ignore no-explicit-any
      (globalThis as any).import = originalImport;
    }
  },
});
