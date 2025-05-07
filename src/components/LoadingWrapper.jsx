import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

export default function LoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simula carregamento
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading) {
    return <Loading />;
  }

  return children;
}