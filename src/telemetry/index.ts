import { setupOpenTelemetry } from './setup.ts';
import { Logger } from './logger.ts';
import {
  verifyLangSmithEnv,
  langsmithSetupInstructions,
} from '../langchain/config.ts';

// Create a root logger for telemetry system
const logger = new Logger('telemetry');

/**
 * Initializes the complete telemetry system.
 * @returns {Object} Telemetry utilities including logger factory
 */
export function initializeTelemetry(): {
  getLogger: (component: string) => Logger;
} {
  logger.info('Initializing telemetry system');

  // Check if running with OpenTelemetry flag
  const isOtelFlagPresent = Deno.args.includes('--unstable-otel');
  const isOtelEnvSet = Deno.env.get('OTEL_DENO') === 'true';

  if (!isOtelFlagPresent || !isOtelEnvSet) {
    logger.warn(
      'OpenTelemetry is not fully configured. Some telemetry features will be limited.',
      {
        isOtelFlagPresent,
        isOtelEnvSet,
      }
    );
    logger.info(
      'To enable OpenTelemetry, run with: OTEL_DENO=true deno run --unstable-otel ...'
    );
  } else {
    logger.info('OpenTelemetry is enabled');
  }

  // Display OpenTelemetry setup information
  setupOpenTelemetry();

  // Check LangSmith configuration
  const isLangSmithConfigured = verifyLangSmithEnv();
  if (!isLangSmithConfigured) {
    logger.warn(
      'LangSmith is not fully configured. LLM tracing will be limited.'
    );
    logger.info(langsmithSetupInstructions());
  } else {
    logger.info('LangSmith is configured');
  }

  logger.info('Telemetry system initialized');

  // Return utilities
  return {
    getLogger: (component: string) => new Logger(component),
  };
}

// Re-export components for easier imports
export { Logger, LogLevel } from './logger.ts';
export { createCustomSpan, createManualSpan } from './tracing.ts';
export * as metrics from './metrics.ts';
