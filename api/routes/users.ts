import { Route } from "../types";
import HttpMethod from "../types/http-methods";
import User from "../controllers/users";
import { verifySession } from "../utils/session";

const USER_URL = "/api/v1";

const userEndpoints: Route[] = [
  {
    path: `${USER_URL}/users`,
    method: HttpMethod.GET,
    middlewares: [verifySession],
    controller: [User.getUsers],
  },
];

export default userEndpoints;
