export function log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void {
  console[level === 'warn' ? 'warn' : level](
    JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    })
  );
}
