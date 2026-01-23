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
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        const rules = validationRules[name];

        if (rules) {
            const fieldErrors = [];
            if (rules.required && !value.trim()) fieldErrors.push('Campo obrigatório');
            if (rules.email && value && !isValidEmail(value)) fieldErrors.push('Email inválido');
            if (rules.minLength && value && value.length < rules.minLength) fieldErrors.push(`Mínimo ${rules.minLength} caracteres`);

            if (fieldErrors.length > 0) setErrors({ ...errors, [name]: fieldErrors[0] });
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
                toast.success("Login realizado com sucesso!");
                navigate("/workouts");
            } else {
                throw new Error('Token não recebido');
            }
        } catch (err) {
            console.error("Error Log:", JSON.stringify(err, null, 2));
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
        <div className="min-h-screen w-full flex items-center justify-center p-6">
            <div className="w-full max-w-md glass-card p-10 animate-[slide-up_0.6s_ease-out]">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-[float_3s_ease-in-out_infinite]">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                        Bem-vindo!
                    </h2>
                    <p className="text-text-muted text-sm">
                        Entre para acompanhar seus treinos
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Seu e-mail"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-dark/50 border text-text-primary placeholder-text-muted backdrop-blur-sm transition-all duration-300 focus:outline-none ${errors.email
                                ? 'border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]'
                                : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-glow)]'
                                } focus:-translate-y-0.5`}
                            required
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="block text-danger text-sm mt-2 pl-1 font-medium animate-[fade-in_0.3s_ease]">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Sua senha"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-dark/50 border text-text-primary placeholder-text-muted backdrop-blur-sm transition-all duration-300 focus:outline-none ${errors.password
                                ? 'border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]'
                                : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-glow)]'
                                } focus:-translate-y-0.5`}
                            required
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className="block text-danger text-sm mt-2 pl-1 font-medium animate-[fade-in_0.3s_ease]">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 px-6 mt-2 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-secondary text-white cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_var(--color-primary-glow)] hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none relative overflow-hidden"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Entrando...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Entrar
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-text-muted text-sm">ou</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                <p className="text-center text-text-secondary">
                    Não tem conta?{" "}
                    <Link
                        to="/register"
                        className="font-bold hover:underline"
                    >
                        Criar conta grátis
                    </Link>
                </p>
            </div>
        </div>
    );
}
