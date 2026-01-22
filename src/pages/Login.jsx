import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";
import { validateForm, isValidEmail } from "../utils/errorHandler";
import { useApiWithToast } from "../hooks/useApi";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { post } = useApiWithToast();

    const validationRules = {
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
            minLength: 6,
        },
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        const rules = validationRules[name];
        
        if (rules) {
            const fieldErrors = [];
            if (rules.required && !value.trim()) {
                fieldErrors.push('Campo obrigatório');
            }
            if (rules.email && value && !isValidEmail(value)) {
                fieldErrors.push('Email inválido');
            }
            if (rules.minLength && value && value.length < rules.minLength) {
                fieldErrors.push(`Mínimo ${rules.minLength} caracteres`);
            }
            
            if (fieldErrors.length > 0) {
                setErrors({ ...errors, [name]: fieldErrors[0] });
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const validation = validateForm(form, validationRules);
        if (!validation.isValid) {
            const firstError = Object.values(validation.errors)[0][0];
            toast.error(firstError);
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        setSaving(true);
        
        try {
            const data = await post(
                `${import.meta.env.VITE_API_URL}users/login`,
                form,
                {},
                'login'
            );
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                toast.success("✅ Login realizado com sucesso!");
                navigate("/workouts");
            } else {
                throw new Error('Token não recebido');
            }
        } catch (err) {
            toast.error(err.message);
            
            if (err.message.toLowerCase().includes('email')) {
                setErrors({ email: err.message });
            } else if (err.message.toLowerCase().includes('senha')) {
                setErrors({ password: err.message });
            }
        } finally {
            setSaving(false);
            setLoading(false);
        }
    }

    return (
        <div className="center-page">
            <div className="auth-card">
                <h2 style={{ 
                    textAlign: "center", 
                    marginBottom: "2rem",
                    fontSize: "2rem",
                    background: "linear-gradient(135deg, #818cf8, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                }}>Bem-vindo de volta!</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ position: "relative" }}>
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email ? 'error' : ''}
                            required
                            autoComplete="email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div style={{ position: "relative" }}>
                        <input
                            name="password"
                            type="password"
                            placeholder="Senha"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password ? 'error' : ''}
                            required
                            autoComplete="current-password"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <button type="submit" disabled={saving} style={{ marginTop: "0.5rem" }}>
                        {saving ? "Entrando..." : "Entrar"}
                    </button>
                    <p style={{ 
                        marginTop: "1.5rem", 
                        textAlign: "center",
                        color: "var(--text-secondary)" 
                    }}>
                        Não tem conta? <Link to="/register">Cadastre-se</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
