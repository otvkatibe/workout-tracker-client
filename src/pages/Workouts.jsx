import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WorkoutCard from "../components/WorkoutCard";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import ConfirmModal from "../components/ConfirmModal";
import { validateForm, isValidDate } from "../utils/errorHandler";
import { useApiWithToast } from "../hooks/useApi";

export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "", duration: "", date: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const token = useAuth();
    const navigate = useNavigate();
    const { get, post, put, del } = useApiWithToast();

    const validationRules = {
        name: { required: true, minLength: 3, maxLength: 100 },
        description: { required: true, minLength: 10, maxLength: 500 },
        duration: { required: true, min: 1, max: 1440 },
        date: { required: true, date: true },
    };

    useEffect(() => {
        if (!token) return navigate("/login");
        setLoading(true);

        get(`${import.meta.env.VITE_API_URL}workouts`, {
            headers: { Authorization: `Bearer ${token}` }
        }, 'workout')
            .then(data => setWorkouts(Array.isArray(data) ? data : []))
            .catch(err => {
                if (!err.message?.toLowerCase().includes("nenhum treino")) {
                    toast.error(err.message);
                }
            })
            .finally(() => setLoading(false));
    }, [token, navigate, get]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        const rules = validationRules[name];
        if (rules) {
            const errs = [];
            if (rules.required && !value) errs.push('Campo obrigatório');
            if (rules.minLength && value?.length < rules.minLength) errs.push(`Mínimo ${rules.minLength} caracteres`);
            if (rules.min && Number(value) < rules.min) errs.push(`Valor mínimo: ${rules.min}`);
            if (rules.date && value && !isValidDate(value)) errs.push('Data inválida');
            if (errs.length > 0) setErrors({ ...errors, [name]: errs[0] });
        }
    }

    function handleEditClick(workout) {
        setForm({
            name: workout.name,
            description: workout.description,
            duration: workout.duration,
            date: workout.date ? workout.date.split('T')[0] : ""
        });
        setEditing(workout.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const validation = validateForm(form, validationRules);
        if (!validation.isValid) {
            toast.error(Object.values(validation.errors)[0][0]);
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        setSaving(true);

        try {
            const workoutData = { ...form, duration: Number(form.duration) };

            if (editing) {
                const data = await put(
                    `${import.meta.env.VITE_API_URL}workouts/${editing}`,
                    workoutData,
                    { headers: { Authorization: `Bearer ${token}` } },
                    'workout'
                );
                setWorkouts(workouts.map(w => w.id === editing ? data : w));
                toast.success("Treino atualizado!");
                setEditing(null);
            } else {
                const data = await post(
                    `${import.meta.env.VITE_API_URL}workouts`,
                    workoutData,
                    { headers: { Authorization: `Bearer ${token}` } },
                    'workout'
                );
                setWorkouts([...workouts, data]);
                toast.success("Treino criado!");
            }
            setForm({ name: "", description: "", duration: "", date: "" });
            setErrors({});
        } catch (err) {
            console.error("Error Log:", JSON.stringify(err, null, 2));
            toast.error(err.message);
        } finally {
            setSaving(false);
            setLoading(false);
        }
    }

    function handleCancelEdit() {
        setEditing(null);
        setForm({ name: "", description: "", duration: "", date: "" });
        setErrors({});
    }

    async function handleDeleteConfirmed() {
        setModalOpen(false);
        if (!deleteId) return;
        setLoading(true);
        try {
            await del(`${import.meta.env.VITE_API_URL}workouts/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } }, 'workout');
            setWorkouts(workouts.filter(w => w.id !== deleteId));
            toast.success("Treino excluído!");
        } catch (err) {
            console.error("Error Log:", JSON.stringify(err, null, 2));
            toast.error(err.message);
        } finally {
            setDeleteId(null);
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        toast.success("Logout realizado!");
        navigate("/login");
    }

    if (loading) return <Loader />;

    const inputBase = "w-full px-4 py-3.5 rounded-xl bg-dark/50 border text-text-primary placeholder-text-muted backdrop-blur-sm transition-all duration-300 focus:outline-none focus:-translate-y-0.5";
    const inputNormal = `${inputBase} border-glass-border focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-glow)]`;
    const inputError = `${inputBase} border-danger focus:border-danger`;

    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-6 pb-12 px-4 animate-[fade-in_0.5s_ease-out]">
            {/* Header */}
            <header className="w-full max-w-6xl flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
                            Workout Tracker
                        </h1>
                        <p className="text-text-muted text-sm">{workouts.length} treino{workouts.length !== 1 && 's'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2.5 px-5 text-sm font-semibold rounded-xl bg-danger/10 border border-danger/30 text-danger transition-all duration-300 hover:bg-danger hover:border-danger hover:text-white hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                </button>
            </header>

            {/* Form Card */}
            <div className="w-full max-w-lg glass-card p-8 mb-10 animate-[slide-up_0.5s_ease-out]">
                <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                    {editing ? (
                        <>
                            <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar Treino
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Treino
                        </>
                    )}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            name="name"
                            placeholder="Nome do treino"
                            value={form.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.name ? inputError : inputNormal}
                            required
                        />
                        {errors.name && <span className="block text-danger text-sm mt-1.5 pl-1">{errors.name}</span>}
                    </div>

                    <div>
                        <textarea
                            name="description"
                            placeholder="Descrição do treino..."
                            value={form.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${errors.description ? inputError : inputNormal} resize-none min-h-[100px]`}
                            required
                            rows={3}
                        />
                        {errors.description && <span className="block text-danger text-sm mt-1.5 pl-1">{errors.description}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                name="duration"
                                type="number"
                                placeholder="Duração (min)"
                                value={form.duration}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.duration ? inputError : inputNormal}
                                required
                                min="1"
                            />
                            {errors.duration && <span className="block text-danger text-sm mt-1.5 pl-1">{errors.duration}</span>}
                        </div>
                        <div>
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.date ? inputError : inputNormal} color-scheme-dark`}
                                required
                            />
                            {errors.date && <span className="block text-danger text-sm mt-1.5 pl-1">{errors.date}</span>}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3.5 px-6 font-bold rounded-xl bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 hover:shadow-[0_10px_40px_-10px_var(--color-primary-glow)] hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                        >
                            {saving ? "Salvando..." : (editing ? "Salvar alterações" : "Adicionar treino")}
                        </button>
                        {editing && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="py-3.5 px-6 font-semibold rounded-xl bg-dark-lighter/50 border border-border text-text-secondary transition-all duration-300 hover:bg-dark-lighter hover:text-text-primary"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Workouts Grid */}
            <div className="w-full max-w-6xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <svg className="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Seus Treinos
                </h2>

                {workouts.length === 0 ? (
                    <div className="glass-card p-12 text-center animate-[fade-scale_0.5s_ease-out]">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-lighter flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Nenhum treino ainda</h3>
                        <p className="text-text-muted">Adicione seu primeiro treino usando o formulário acima!</p>
                    </div>
                ) : (
                    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {workouts.map((w, i) => (
                            <WorkoutCard
                                key={w.id}
                                workout={w}
                                onDelete={() => { setDeleteId(w.id); setModalOpen(true); }}
                                onEdit={handleEditClick}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                open={modalOpen}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => { setModalOpen(false); setDeleteId(null); }}
                message="Deseja realmente excluir este treino?"
            />
        </div>
    );
}