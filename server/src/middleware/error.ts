import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export const notFound: RequestHandler = (request, response) => response.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: `No route exists at ${request.method} ${request.path}.` } });

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;
  if (error instanceof ZodError) return response.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'One or more fields are invalid.', details: error.issues } });
  const status = Number(error.status) || 500;
  const code = String(error.code ?? (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED'));
  if (status >= 500) console.error(error);
  response.status(status).json({ error: { code, message: status === 500 ? 'The Sivorment service encountered an unexpected error.' : error.message } });
};
