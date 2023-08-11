import { UsersResponse } from "@/types/users";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const toData = <R>(res: AxiosResponse<R>): R => {
  return res.data;
};

const fetchUrl =
  <R, P extends unknown = undefined>(url: string) =>
  (
    params?: P,
    headers?: AxiosRequestConfig["headers"],
    signal?: AxiosRequestConfig["signal"]
  ): Promise<R> =>
    axios
      .get<R>(url, {
        headers,
        params,
        signal,
      })
      .then(toData);

export const fetchUsers: (
  options: Record<string, string | undefined>,
  signal: AxiosRequestConfig["signal"]
) => Promise<UsersResponse> = (options, signal) =>
  fetchUrl<UsersResponse, Record<string, string | undefined>>("/users")(
    options,
    undefined,
    signal
  );
