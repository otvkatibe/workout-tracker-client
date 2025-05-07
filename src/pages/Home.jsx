import { Link } from "react-router-dom";
import "../Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao Registro de Treinos</h1>
        <p>Gerencie seus treinos de forma simples e eficiente.</p>
      </header>

      <section className="home-banner">
        <img
          src=""
          alt=""
          className=""
        />
      </section>

      <section className="home-actions">
        <h2>Comece agora</h2>
        <p>Escolha uma das opções abaixo para acessar o sistema:</p>
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-button login-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="home-button register-button">Registrar</button>
          </Link>
        </div>
      </section>

      <section className="home-features">
        <h2>Funcionalidades</h2>
        <ul>
          <li>📋 Registre seus treinos de forma organizada.</li>
          <li>🔒 Acesse suas informações com segurança.</li>
          <li>📊 Acompanhe seu progresso ao longo do tempo.</li>
        </ul>
      </section>

      <footer className="home-footer">
        <p>© 2025 Registro de Treinos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}