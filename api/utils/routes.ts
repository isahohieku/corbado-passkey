import { Application } from "express";
import { Route } from "../types";
import routes from "../routes";

export const configureRoutes = (app: Application): void => {
  for (const route of routes as Route[]) {
    const { method, path, middlewares, controller } = route;
    app[method](path, middlewares, controller);
  }
};
