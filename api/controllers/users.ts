import includes from "lodash/includes";
import orderBy from "lodash/orderBy";
import { Request, Response, NextFunction } from "express";
import usersRepo from "../repository/users.json";

import sendSuccess from "../responses/success";

import { UserAPI } from "../types/users";
import { paginate } from "../utils/pagination";

class UserService {
  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        cities,
        startDate,
        endDate,
        search,
        pageNumber = 1,
        pageSize = 10,
        sortBy,
        sortDesc,
      } = req.query;

      const users = usersRepo.users;

      let result: UserAPI[] = [...users];

      // Cities filter
      if (cities) {
        const selectedCities = (cities as string)
          .split(",")
          .map((city) => city.toLowerCase());
        result = result.filter(({ address: { city: _city } }) =>
          includes(selectedCities, _city.toLowerCase())
        );
      }

      // Start Date filter
      if (startDate) {
        result = result.filter(
          ({ birthDate }) =>
            new Date(startDate as string).getTime() <=
            new Date(birthDate).getTime()
        );
      }

      // End Date filter
      if (endDate) {
        result = result.filter(
          ({ birthDate }) =>
            new Date(endDate as string).getTime() >=
            new Date(birthDate).getTime()
        );
      }

      // Search
      if (search) {
        const lowerSearch = (search as string).toLowerCase();
        result = result.filter(
          ({
            address: { city },
            email,
            firstName,
            lastName,
            company: { name },
            age,
          }) =>
            includes(city.toLowerCase(), lowerSearch) ||
            includes(email.toLowerCase(), lowerSearch) ||
            includes(firstName.toLowerCase(), lowerSearch) ||
            includes(lastName.toLowerCase(), lowerSearch) ||
            includes(name.toLowerCase(), lowerSearch) ||
            age === Number(lowerSearch)
        );
      }

      //   Sort
      if (sortBy && sortDesc) {
        const sortByItems = (sortBy as string).split(",");
        const sortDirections = sortDesc
          ? (sortDesc as string)
              .split(",")
              .map((item) => (item === "true" ? "asc" : "desc"))
          : Array(sortByItems.length).fill("asc");
        result = orderBy(result, sortByItems, sortDirections);
      }

      //   Total count
      const count = result.length;

      // Pagination
      result = paginate<UserAPI>(result, Number(pageSize), Number(pageNumber));

      const resBody = { count, users: result };

      sendSuccess(
        res,
        "user.service.ts",
        resBody,
        "Users fetched successfully"
      );
    } catch (e) {
      next(e);
    }
  }
}

export default new UserService();
