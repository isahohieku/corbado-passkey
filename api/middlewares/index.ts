import { Application } from "express";
import bodyParser from "./bodyParser";
import cors from "./cors";
import helmet from "./helmet";
import cookieParser from "./cookie-parser";

const middlewares = [bodyParser, cors, helmet, cookieParser];

export const middlewaresConfig = (app: Application): void => {
  for (const middleware of middlewares) {
    middleware(app);
  }
};
