import { Problem, UpdateProblem } from "@/app/psadder/type";
import axiosClient from "@/lib/api/axiosClient";

export const createProblem = async (problem: Problem) => {
  return await axiosClient.post("/problem", problem);
};

export const updateProblem = async (problem: UpdateProblem) => {
  return await axiosClient.post("/problem/update", problem);
};

export const getProblem = async (id: number) => {
  return (await axiosClient.get(`/problem/full?id=${id}`)).data;
};

export const getProblemList = async (all?: boolean) => {
  return (await axiosClient.get(`/problem/list?all=${!!all}`)).data;
};
