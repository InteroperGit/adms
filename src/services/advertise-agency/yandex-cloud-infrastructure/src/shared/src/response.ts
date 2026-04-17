import type { APIGatewayProxyResult } from './types';

function buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
}

/**
 * Creates a 400 Bad Request response.
 *
 * @param error - Error message or Error instance to include in the response body.
 * @param extraHeaders - Optional additional HTTP headers to merge into the response.
 * @returns An API Gateway response with status 400 and `{ ok: false, error }` body.
 */
export function badRequest(
  error: string | Error,
  extraHeaders?: Record<string, string>,
): APIGatewayProxyResult {
  const msg = error instanceof Error ? error.message : error;
  return {
    statusCode: 400,
    headers: buildHeaders(extraHeaders),
    body: JSON.stringify({ ok: false, error: msg }),
  };
}

/**
 * Creates a 500 Internal Server Error response.
 *
 * @param error - Error message or Error instance to include in the response body.
 * @param extraHeaders - Optional additional HTTP headers to merge into the response.
 * @returns An API Gateway response with status 500 and `{ ok: false, error }` body.
 */
export function serverError(
  error: string | Error,
  extraHeaders?: Record<string, string>,
): APIGatewayProxyResult {
  const msg = error instanceof Error ? error.message : error;
  return {
    statusCode: 500,
    headers: buildHeaders(extraHeaders),
    body: JSON.stringify({ ok: false, error: msg }),
  };
}

/**
 * Creates a JSON response with the given status code and payload.
 *
 * @param statusCode - HTTP status code for the response.
 * @param payload - Data to serialize as the JSON response body.
 * @param extraHeaders - Optional additional HTTP headers to merge into the response.
 * @returns An API Gateway response with the specified status and JSON body.
 */
export function jsonResponse(
  statusCode: number,
  payload: unknown,
  extraHeaders?: Record<string, string>,
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: buildHeaders(extraHeaders),
    body: JSON.stringify(payload),
  };
}
