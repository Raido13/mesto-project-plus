import { StatusCodes } from '../utils/statusCodes';

export default class RequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BadRequest;
  }
}
