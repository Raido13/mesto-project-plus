import { Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
};
