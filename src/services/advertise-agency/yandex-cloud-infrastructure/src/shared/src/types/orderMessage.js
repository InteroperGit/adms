"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_SOURCE = exports.MESSAGE_VERSION = void 0;
exports.buildOrderMessage = buildOrderMessage;
exports.MESSAGE_VERSION = '2.0';
exports.MESSAGE_SOURCE = 'orders-intake';
function buildOrderMessage(order, consent, correlationId) {
    return {
        type: 'ORDER_SUBMITTED',
        messageId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: exports.MESSAGE_SOURCE,
        correlationId,
        version: exports.MESSAGE_VERSION,
        payload: order,
        consent,
    };
}
