import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Bem-vindo à área logada!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}