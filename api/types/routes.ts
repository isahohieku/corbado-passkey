import { Request, Response, NextFunction } from "express";
import HttpMethod from "./http-methods";

export interface RouteHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface Route {
  path: string;
  method: HttpMethod;
  middlewares: RouteHandler[];
  controller: RouteHandler[];
}
