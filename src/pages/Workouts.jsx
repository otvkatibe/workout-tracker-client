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

    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-8 pb-12 px-4 animate-fade-in">
            <header className="w-full max-w-5xl flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gradient tracking-tight">
                            Workout Tracker
                        </h1>
                        <p className="text-text-muted text-sm font-medium tracking-wide">
                            {workouts.length} {workouts.length !== 1 ? 'treinos registrados' : 'treino registrado'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-danger text-sm py-2 px-4 shadow-none"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                </button>
            </header>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

                <div className="order-2 lg:order-1 glass-card p-6 sticky top-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text-main border-b border-white/5 pb-4">
                        {editing ? (
                            <>
                                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar Treino
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Novo Treino
                            </>
                        )}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Nome</label>
                            <input
                                name="name"
                                placeholder="Ex: Treino de Peito"
                                value={form.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`input-field ${errors.name ? 'input-error' : ''}`}
                                required
                            />
                            {errors.name && <span className="text-danger text-xs font-medium ml-1 block">{errors.name}</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Descrição</label>
                            <textarea
                                name="description"
                                placeholder="Detalhes dos exercícios..."
                                value={form.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`input-field min-h-[120px] resize-none ${errors.description ? 'input-error' : ''}`}
                                required
                            />
                            {errors.description && <span className="text-danger text-xs font-medium ml-1 block">{errors.description}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Duração</label>
                                <div className="relative">
                                    <input
                                        name="duration"
                                        type="number"
                                        placeholder="0"
                                        value={form.duration}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field pr-12 ${errors.duration ? 'input-error' : ''}`}
                                        required
                                        min="1"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">min</span>
                                </div>
                                {errors.duration && <span className="text-danger text-xs font-medium ml-1 block">{errors.duration}</span>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Data</label>
                                <input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`input-field ${errors.date ? 'input-error' : ''}`}
                                    required
                                />
                                {errors.date && <span className="text-danger text-xs font-medium ml-1 block">{errors.date}</span>}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary flex-[2] text-white shadow-lg shadow-violet-500/25"
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Salvando...
                                    </span>
                                ) : (
                                    editing ? "Salvar Alterações" : "Adicionar Treino"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="order-1 lg:order-2 w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full block"></span>
                            Seus Treinos
                        </h2>
                    </div>

                    {workouts.length === 0 ? (
                        <div className="glass-card p-16 text-center border-dashed border-2 border-white/10">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Comece sua jornada!</h3>
                            <p className="text-text-muted max-w-xs mx-auto leading-relaxed">
                                Parece que você ainda não registrou nenhum treino. Use o formulário ao lado para começar.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                            {workouts.map((w, i) => (
                                <WorkoutCard
                                    key={w.id}
                                    workout={w}
                                    onDelete={() => { setDeleteId(w.id); setModalOpen(true); }}
                                    onEdit={handleEditClick}
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={modalOpen}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => { setModalOpen(false); setDeleteId(null); }}
                message="Tem certeza que deseja excluir este treino?"
            />
        </div>
    );
}