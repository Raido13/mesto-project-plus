import { StatusCodes } from '../utils/statusCodes';

export default class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UnAuth;
  }
}
