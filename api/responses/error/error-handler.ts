import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import throwError from '.';
import CustomError from './custom-error';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    // console.log(err);
    if (err instanceof CustomError) {
        logger('error.response.ts', err.message, 'error'); // For debugging
        const message = (typeof err === 'string') ? err : err.message;
        return throwError(res, err.code, message, err.statusCode, err.data);
    } else {
        logger('error.response.ts', 'uncaught exception', 'error'); // For debugging
        return throwError(res);
    }
};

export default errorHandler;
