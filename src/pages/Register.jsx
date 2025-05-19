import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { setLoading } = useLoading();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            toast.error("Preencha todos os campos.");
            return;
        }
        setLoading(true);
        setSaving(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao cadastrar.");
            toast.success("Cadastro realizado com sucesso!");
            navigate("/login");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
            setLoading(false);
        }
    }

    return (
        <div className="center-page">
            <div className="auth-card">
                <form onSubmit={handleSubmit}>
                    <h2 style={{ textAlign: "center", color: "#595CFF", marginBottom: 24 }}>Cadastro</h2>
                    <input
                        name="name"
                        placeholder="Nome"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={saving}>
                        {saving ? "Cadastrando..." : "Cadastrar"}
                    </button>
                    <p>Já tem conta? <Link to="/login">Entrar</Link></p>
                </form>
            </div>
        </div>
    );
}