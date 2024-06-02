import { StatusCodes } from '../utils/statusCodes';

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.Forbidden;
  }
}
