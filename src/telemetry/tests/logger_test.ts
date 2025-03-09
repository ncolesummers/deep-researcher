import { assertEquals, assertStringIncludes } from '@std/assert';
import { spy } from 'https://deno.land/std/testing/mock.ts';
import { Logger, LogLevel } from '../logger.ts';

/**
 * Tests for the Logger class
 */
Deno.test('Logger - creates a logger with the correct component name', () => {
  const componentName = 'test-component';
  const logger = new Logger(componentName);

  // This is a bit of implementation testing, but we'll directly check the private property
  // @ts-ignore - Accessing private property for testing
  assertEquals(logger.component, componentName);
});

Deno.test('Logger - formats log messages correctly', () => {
  const componentName = 'test-component';
  const logger = new Logger(componentName);
  const message = 'Test message';
  const details = { key: 'value' };

  // Spy on console methods
  const logSpy = spy(console, 'log');
  const warnSpy = spy(console, 'warn');
  const errorSpy = spy(console, 'error');

  try {
    // Test each log level
    logger.debug(message, details);
    logger.info(message, details);
    logger.warn(message, details);
    logger.error(message, details);

    // Verify console.log was called for debug and info
    assertEquals(logSpy.calls.length, 2);

    // Parse the logged JSON to verify content for debug level
    const debugLog = JSON.parse(logSpy.calls[0].args[0]);
    assertEquals(debugLog.level, LogLevel.DEBUG);
    assertEquals(debugLog.message, message);
    assertEquals(debugLog.component, componentName);
    assertEquals(debugLog.key, details.key);

    // Parse the logged JSON to verify content for info level
    const infoLog = JSON.parse(logSpy.calls[1].args[0]);
    assertEquals(infoLog.level, LogLevel.INFO);

    // Verify console.warn was called
    assertEquals(warnSpy.calls.length, 1);
    const warnLog = JSON.parse(warnSpy.calls[0].args[0]);
    assertEquals(warnLog.level, LogLevel.WARN);

    // Verify console.error was called
    assertEquals(errorSpy.calls.length, 1);
    const errorLog = JSON.parse(errorSpy.calls[0].args[0]);
    assertEquals(errorLog.level, LogLevel.ERROR);
  } finally {
    // Restore original console methods
    logSpy.restore();
    warnSpy.restore();
    errorSpy.restore();
  }
});

Deno.test('Logger - includes timestamp in logs', () => {
  const logger = new Logger('test-component');
  const logSpy = spy(console, 'log');

  try {
    logger.info('Test message');

    // Verify the timestamp was included
    const loggedData = JSON.parse(logSpy.calls[0].args[0]);
    assertStringIncludes(loggedData.timestamp, 'T'); // Simple check for ISO format

    // Attempt to parse the timestamp to ensure it's valid
    const timestamp = new Date(loggedData.timestamp);
    assertEquals(isNaN(timestamp.getTime()), false);
  } finally {
    logSpy.restore();
  }
});

Deno.test('Logger - allows empty details object', () => {
  const logger = new Logger('test-component');
  const logSpy = spy(console, 'log');

  try {
    // Call without providing details
    logger.info('Test message');

    // Should not throw and should log correctly
    assertEquals(logSpy.calls.length, 1);
    const loggedData = JSON.parse(logSpy.calls[0].args[0]);
    assertEquals(loggedData.message, 'Test message');
  } finally {
    logSpy.restore();
  }
});
