// Configure OpenTelemetry using Deno's native support
export function setupOpenTelemetry() {
  // This is purely documentation - the actual setup happens via
  // environment variables and the --unstable-otel flag
  console.log("Using Deno's built-in OpenTelemetry support");
  console.log(
    'Make sure to run with: OTEL_DENO=true deno run --unstable-otel ...'
  );
}
