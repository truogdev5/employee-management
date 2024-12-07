import { Response } from 'express';
import { StatusCode } from './enum';

export const successResponse = (
   res: Response,
   data: any,
   statusCode: number = StatusCode.SUCCESS,
   message: string = 'Success'
) => {
   res.status(statusCode).json({
      status: statusCode ? statusCode : StatusCode.SUCCESS,
      data: data ? data : null,
      message,
   });
};
