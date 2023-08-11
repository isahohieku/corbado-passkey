require('dotenv').config();
import express, { Express } from "express";
import { createServer, Server as HTTPServer } from "http";
import { logger } from "./utils/logger";
import {middlewaresConfig} from "./middlewares";
import { configureRoutes } from "./utils/routes";
import unknownRouteConfig from "./responses/error/unkown-routes";
import errorHandlerConfig from "./responses/error/error-handler";

class Server {
  private httpServer: HTTPServer;
  public app: Express;

  public constructor() {
    this.initializeApp();
    this.configureMiddlewares();
    this.configureRoutes();
    this.handleMissingRoutes();
    this.handleErrorsGlobally();
  }

  private initializeApp(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
  }

  private configureMiddlewares(): void {
    middlewaresConfig(this.app);
  }

  private configureRoutes(): void {
    configureRoutes(this.app);
  }

  private handleMissingRoutes(): void {
    this.app.use(unknownRouteConfig);
  }

  private handleErrorsGlobally(): void {
    this.app.use(errorHandlerConfig);
  }

  public listen(): void {
    /* App initialization */
    const { PORT } = process.env;
    this.httpServer.listen(PORT, (): void => {
      logger("server/index.ts", `App is listening on port ${PORT}`, "info");
    });
  }
}

/* App declaration */
const app = new Server();

/* App initialization */
app.listen();
