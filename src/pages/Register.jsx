import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";
import { validateForm, isValidEmail, isStrongPassword } from "../utils/errorHandler";
import { useApiWithToast } from "../hooks/useApi";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { post } = useApiWithToast();

    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_]+$/,
            patternMessage: 'Apenas letras, números e underscore',
        },
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
            minLength: 8,
            strongPassword: true,
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
            if (rules.minLength && value && value.length < rules.minLength) {
                fieldErrors.push(`Mínimo ${rules.minLength} caracteres`);
            }
            if (rules.maxLength && value && value.length > rules.maxLength) {
                fieldErrors.push(`Máximo ${rules.maxLength} caracteres`);
            }
            if (rules.pattern && value && !rules.pattern.test(value)) {
                fieldErrors.push(rules.patternMessage || 'Formato inválido');
            }
            if (rules.email && value && !isValidEmail(value)) {
                fieldErrors.push('Email inválido');
            }
            if (rules.strongPassword && value) {
                const strongCheck = isStrongPassword(value);
                if (!strongCheck.isValid) {
                    fieldErrors.push(strongCheck.message);
                }
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
                `${import.meta.env.VITE_API_URL}users/register`,
                form,
                {},
                'register'
            );
            
            toast.success("✅ Conta criada com sucesso! Faça login.");
            navigate("/login");
        } catch (err) {
            toast.error(err.message);
            
            if (err.message.toLowerCase().includes('username') || err.message.toLowerCase().includes('usuário')) {
                setErrors({ username: err.message });
            } else if (err.message.toLowerCase().includes('email')) {
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
                }}>Criar Conta</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        placeholder="Nome de usuário"
                        value={form.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.username ? 'error' : ''}
                        required
                        autoComplete="username"
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                    
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
                    
                    <input
                        name="password"
                        type="password"
                        placeholder="Senha (mín. 8 caracteres)"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password ? 'error' : ''}
                        required
                        autoComplete="new-password"
                        minLength={8}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                    
                    <button type="submit" disabled={saving}>
                        {saving ? "Cadastrando..." : "Cadastrar"}
                    </button>
                    <p style={{ 
                        marginTop: "1.5rem", 
                        textAlign: "center",
                        color: "var(--text-secondary)" 
                    }}>
                        Já tem conta? <Link to="/login">Entrar</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
