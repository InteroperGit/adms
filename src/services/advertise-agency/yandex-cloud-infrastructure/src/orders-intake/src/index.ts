import { sendMessageToQueueAsync } from './messageQueue';
import { buildOrderMessage, type OrderConsentRecord } from '@shared';
import { badRequest, serverError, jsonResponse } from '@shared';
import { logWarn, logError } from '@shared';
import { checkCaptchaAsync } from './smartCaptcha';
import {
  parseBody,
  getCaptchaToken,
  getClientIp,
  getOrder,
  getConsent,
  getRequestId,
} from './utils';

const INNER_ERROR = 'Inner error';

async function validateCaptchaAsync(
  token: string,
  ipAddress: string | undefined,
  requestId: string
) {
  const captchaOk = await checkCaptchaAsync(token, ipAddress ?? '');

  if (!captchaOk) {
    logWarn('Captcha validation failed', { requestId });
    return badRequest(INNER_ERROR);
  }

  return null;
}

export const handler = async function (event: Record<string, unknown>) {
  const requestId = getRequestId(event);
  const ipAddress = getClientIp(event);

  try {
    let body: Record<string, unknown>;
    try {
      body = parseBody(event);
    } catch {
      logWarn('Invalid JSON body', { requestId });
      return badRequest(INNER_ERROR);
    }

    const captchaToken = getCaptchaToken(body);
    if (!captchaToken) {
      logWarn('Captcha token is required', { requestId });
      return badRequest(INNER_ERROR);
    }

    const order = getOrder(body);
    if (!order || typeof order !== 'object') {
      logWarn('Order is required', { requestId });
      return badRequest(INNER_ERROR);
    }

    const consent = getConsent(body);
    if (!consent || typeof consent !== 'object') {
      logWarn('Consent is required', { requestId });
      return badRequest(INNER_ERROR);
    }

    const captchaResponse = await validateCaptchaAsync(captchaToken, ipAddress, requestId);
    if (captchaResponse) {
      return captchaResponse;
    }

    const message = buildOrderMessage(
      order as Record<string, unknown>,
      consent as OrderConsentRecord,
      requestId
    );
    const messageId = await sendMessageToQueueAsync(message);
    return jsonResponse(200, { messageId });
  } catch (error) {
    logError(error instanceof Error ? error.message : String(error), { requestId });
    return serverError(error instanceof Error ? error : 'Unknown error');
  }
};
