import { sendMessageToQueueAsync } from './messageQueue';
import { checkCaptchaAsync } from './smartCaptcha';
import {
    badRequest,
    serverError,
    jsonResponse
} from './messages';
import {
    parseBody,
    getCaptchaToken,
    getClientIp,
    getOrder,
    getRequestId
} from './utils';
import {
    logWarn,
    logError
} from './logs';

const INNER_ERROR = "Inner error";

async function validateCaptchaAsync(token: string, ipAddress: string | undefined, requestId: string) {
    const captchaOk = await checkCaptchaAsync(token, ipAddress ?? '');

    if (!captchaOk) {
        logWarn('Captcha validation failed', { requestId });
        return badRequest(INNER_ERROR);
    }

    return null;
}

export const handler = async function (event: Record<string, unknown>) {
    const requestId = getRequestId(event);

    try {
        let body: Record<string, unknown>;
        try {
            body = parseBody(event);
        }
        catch {
            logWarn('Invalid JSON body', { requestId });
            return badRequest(INNER_ERROR);
        }

        const captchaToken = getCaptchaToken(body);
        if (!captchaToken) {
            logWarn('Captcha token is required', { requestId });
            return badRequest(INNER_ERROR);
        }

        const order = getOrder(body);
        if (!order || typeof order !== "object") {
            logWarn('Order is required', { requestId });
            return badRequest(INNER_ERROR);
        }

        const captchaResponse = await validateCaptchaAsync(captchaToken, getClientIp(event), requestId);
        if (captchaResponse) {
            return captchaResponse;
        }

        const messageId = await sendMessageToQueueAsync(JSON.stringify(order));
        return jsonResponse(200, { messageId });
    }
    catch (error) {
        logError(error as Error, { requestId });
        return serverError(error as string | Error);
    }
};
