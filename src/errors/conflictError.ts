import { StatusCodes } from '../utils/statusCodes';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.Conflict;
  }
}
