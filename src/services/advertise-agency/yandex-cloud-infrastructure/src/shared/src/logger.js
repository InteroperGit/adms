"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = logInfo;
exports.logWarn = logWarn;
exports.logError = logError;
exports.log = log;
function logInfo(message, meta) {
    log('info', message, meta);
}
function logWarn(message, meta) {
    log('warn', message, meta);
}
function logError(message, meta) {
    log('error', message, meta);
}
function log(level, message, meta) {
    console[level === 'warn' ? 'warn' : level](JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
        ...meta,
    }));
}
