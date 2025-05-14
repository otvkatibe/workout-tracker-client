import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao cadastrar");
      toast.success("Cadastro realizado! Faça login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </form>
  );
}