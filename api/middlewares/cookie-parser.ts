import { Application } from 'express';
import cookieParser from 'cookie-parser';

const appCookieParser = (app: Application): void => {
    app.use(cookieParser());
};

export default appCookieParser;