import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const set = (name: string, value: string, { ...options }) => {
  return cookies.set(name, value, { secure: true, path: "/", ...options });
};

export const get = (name: string) => {
  return cookies.get(name);
};

export const remove = (name: string) => {
  return cookies.remove(name, { path: "/" });
};
