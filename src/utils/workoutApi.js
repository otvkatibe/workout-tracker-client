import { apiRequest } from "./api";

export const fetchWorkouts = async (token) => {
  return await apiRequest(`${import.meta.env.VITE_API_URL}workouts`, "GET", null, token);
};

export const updateWorkout = async (id, data, token) => {
  return await apiRequest(`${import.meta.env.VITE_API_URL}workouts/${id}`, "PUT", data, token);
};

export const patchWorkout = async (id, field, value, token) => {
  return await apiRequest(`${import.meta.env.VITE_API_URL}workouts/${id}`, "PATCH", { [field]: value }, token);
};

export const deleteWorkout = async (id, token) => {
  return await apiRequest(`${import.meta.env.VITE_API_URL}workouts/${id}`, "DELETE", null, token);
};