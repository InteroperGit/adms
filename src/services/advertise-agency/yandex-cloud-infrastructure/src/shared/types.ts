export interface APIGatewayProxyEvent {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string>;
  body?: string;
  isBase64Encoded: boolean;
}

export interface APIGatewayProxyResult {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
}

export type Handler = (
  event: APIGatewayProxyEvent,
  context: unknown
) => Promise<APIGatewayProxyResult>;

export function jsonResponse(
  statusCode: number,
  data: unknown,
  extraHeaders?: Record<string, string>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(data),
  };
}
