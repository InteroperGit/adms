import { describe, it, expect } from 'vitest';
import { badRequest, serverError, jsonResponse } from './messages';

describe('badRequest', () => {
    it('returns 400 with error message', () => {
        const res = badRequest('Something went wrong');
        expect(res.statusCode).toBe(400);
        expect(res.headers).toEqual({ 'Content-Type': 'application/json' });
        expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'Something went wrong' });
    });
});

describe('serverError', () => {
    it('returns 500 with string error', () => {
        const res = serverError('Internal failure');
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'Internal failure' });
    });

    it('extracts message from Error object', () => {
        const err = new Error('DB connection lost');
        const res = serverError(err);
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'DB connection lost' });
    });
});

describe('jsonResponse', () => {
    it('returns the given status code and payload', () => {
        const res = jsonResponse(201, { id: 42 });
        expect(res.statusCode).toBe(201);
        expect(res.headers).toEqual({ 'Content-Type': 'application/json' });
        expect(JSON.parse(res.body)).toEqual({ id: 42 });
    });
});
