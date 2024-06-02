import { StatusCodes } from '../utils/statusCodes';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NotFound;
  }
}
