export interface AuthData {
  accessToken: string;
  user: {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
  };
}
