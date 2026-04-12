export function logWarn(message: string, extra: Record<string, unknown> = {}) {
    console.warn(JSON.stringify({
        level: "warn",
        message,
        ...extra
    }));
}

export function logError(message: string | Error, extra: Record<string, unknown> = {}) {
    const msg = message instanceof Error ? message.message : message;
    console.error(JSON.stringify({
        level: "error",
        message: msg,
        ...extra
    }));
}
