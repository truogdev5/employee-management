import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { StatusCode } from '../utils/enum';

export const checkToken = (
   req: any,
   res: Response,
   next: NextFunction
): void => {
   const token = req.header('Authorization');

   if (!token) {
      res.status(StatusCode.FORBIDDEN).json({
         status: StatusCode.FORBIDDEN,
         message: 'Access denied. No token provided.',
      });
      return;
   }

   try {
      const tokenValue = token.split(' ')[1];
      if (!tokenValue) {
         res.status(StatusCode.FORBIDDEN).json({
            status: StatusCode.FORBIDDEN,
            message: 'Access denied. No token provided.',
         });
         return;
      }

      const decoded = jwt.verify(tokenValue, authConfig.accessTokenSecret);
      req['user'] = decoded;

      next();
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         res.status(StatusCode.UNAUTHORIZED).json({
            status: StatusCode.UNAUTHORIZED,
            message: 'Token has expired.',
         });
      } else if (error instanceof jwt.JsonWebTokenError) {
         res.status(StatusCode.UNAUTHORIZED).json({
            status: StatusCode.UNAUTHORIZED,
            message: 'Invalid token.',
         });
      } else {
         res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            status: StatusCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error.',
         });
      }
   }
};
