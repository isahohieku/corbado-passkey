import { NextFunction, Request, Response } from "express";
import { SDK, Configuration } from "@corbado/node-sdk";
import CustomError from "../responses/error/custom-error";
import { RouteHandler } from "../types/routes";
import responseCodes from "../constants/response-codes";
import responseMessages from "../constants/response-messages";
import { logger } from "./logger";
import throwError from "../responses/error";

const { PROJECT_ID, API_SECRET } = process.env;

const config = new Configuration(PROJECT_ID, API_SECRET);
const corbado = new SDK(config);

export const verifySession: RouteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log({ cookies: req.cookies })
    await corbado.session.getCurrentUser(req);
    logger("auth.service.ts", "Session verified", "info");
    next();
  } catch (e) {
    console.log({ e })
    logger("auth.service.ts", "Session expired, please login again", "info");
    throwError(res,responseCodes.UNAUTHORIZED,
      responseMessages.UNAUTHORIZED,
      401)
  }
};
