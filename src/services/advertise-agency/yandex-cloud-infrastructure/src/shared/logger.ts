export function logInfo(message: string, meta?: Record<string, unknown>): void {
  log('info', message, meta);
}

export function logWarn(message: string, meta?: Record<string, unknown>): void {
  log('warn', message, meta);
}

export function logError(message: string, meta?: Record<string, unknown>): void {
  log('error', message, meta);
}

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
