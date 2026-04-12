export function badRequest(error: string) {
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error }),
    };
}

export function serverError(error: string | Error) {
    const msg = error instanceof Error ? error.message : error;
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: msg }),
    };
}

export function jsonResponse(statusCode: number, payload: unknown) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    };
}
