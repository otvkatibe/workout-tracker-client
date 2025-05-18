import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        if (!form.email.trim() || !form.password.trim()) {
            toast.error("Preencha todos os campos.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao entrar.");
            localStorage.setItem("token", data.token);
            toast.success("Login realizado com sucesso!");
            navigate("/workouts");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="center-page">
            <div className="auth-card">
                <form onSubmit={handleSubmit}>
                    <h2 style={{ textAlign: "center", color: "#595CFF", marginBottom: 24 }}>Login</h2>
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
                    <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                    <p style={{ marginTop: 16, textAlign: "center" }}>
                        Não tem conta? <Link to="/register" style={{ color: "#595CFF" }}>Cadastre-se</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}