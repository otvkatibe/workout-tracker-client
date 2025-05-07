import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { token, login, logout } = useContext(AuthContext);

  const isAuthenticated = !!token;

  return { token, login, logout, isAuthenticated };
};