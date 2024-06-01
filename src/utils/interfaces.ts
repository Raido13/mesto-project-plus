import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface SessionError extends Error {
  statusCode: number,
  message: string
}

export interface SessionRequest extends Request {
  user?: JwtPayload
}
