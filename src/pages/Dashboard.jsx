import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bem-vindo de volta!</h1>
      <p>Escolha uma das opções abaixo para continuar:</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout} style={{ margin: "10px" }}>Sair</button>
        <button onClick={() => navigate("/workouts")} style={{ margin: "10px" }}>
          Ver Treinos
        </button>
        <button onClick={() => navigate("/manage-workouts")} style={{ margin: "10px" }}>
          Gerenciar Treinos
        </button>
      </div>
    </div>
  );
}