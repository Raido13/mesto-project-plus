import { Request } from 'express';

export interface SessionError extends Error {
  statusCode: number,
  message: string
}

export interface SessionRequest extends Request {
  user?: {
    _id: string
  }
}