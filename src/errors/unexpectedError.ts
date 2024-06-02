import { StatusCodes } from '../utils/statusCodes';

export default class UnexpectedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.Unexpect;
  }
}
