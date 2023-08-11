export interface User {
  fullname: string;
  email: string;
  birthDate: string;
  company: string;
  address: string;
  image: string;
  age: number;
}

export interface UserAPI {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  company: { name: string };
  address: { city: string };
  image: string;
  age: number;
}

export interface UsersResponse {
  data: {
    users: UserAPI[];
    count: number;
  };
  message: string;
  code: string;
  statusCode: number;
}
