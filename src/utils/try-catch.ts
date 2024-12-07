import { NextFunction, Request, Response } from 'express';
import { StatusCode } from './enum';

export const tryCatch = (controller: Function) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         await controller(req, res, next);
      } catch (error) {
         if (error instanceof AppError) {
            res.status(error.statusCode).json({
               status: error.statusCode,
               message: error.message,
            });
         } else {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
               status: StatusCode.INTERNAL_SERVER_ERROR,
               message: 'Internal server error',
            });
         }
      }
   };
};

export class AppError extends Error {
   statusCode: number;
   constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
   }
}
