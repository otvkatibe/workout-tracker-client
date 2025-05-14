import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao logar");
      localStorage.setItem("token", data.token);
      toast.success("Login realizado!");
      navigate("/workouts");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" type="email" placeholder="e-mail" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      <p>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
    </form>
  );
}