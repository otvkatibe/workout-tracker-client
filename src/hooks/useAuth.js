import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useAuth() {
  const navigate = useNavigate();
  const tokenChecked = useRef(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken && tokenChecked.current) {
        toast.error("Sessão expirada, faça login novamente.");
        navigate("/login");
      }
      tokenChecked.current = currentToken;
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return localStorage.getItem("token");
}