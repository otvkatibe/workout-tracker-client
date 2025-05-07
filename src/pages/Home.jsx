import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bem-vindo ao CRUD Autenticado</h1>
      <p>Por favor, escolha uma opção abaixo:</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login">
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{ padding: "10px 20px" }}>Registrar</button>
        </Link>
      </div>
    </div>
  );
}