import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerId = req.headers['x-correlation-id'];
  let correlationId: string;
  
  if (headerId) {
    correlationId = headerId as string;
  } else {
    correlationId = uuidv4();
  }

  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
}
