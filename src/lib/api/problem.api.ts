import { Problem } from "@/app/psadder/type";
import axiosClient from "@/lib/api/axiosClient";

export const createProblem = async (problem: Problem) => {
  return await axiosClient.post("/problem", problem);
};

export const getProblemList = async () => {
  return await axiosClient.get("/problem/list");
};
