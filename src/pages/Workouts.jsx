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
        name: {
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        description: {
            required: true,
            minLength: 10,
            maxLength: 500,
        },
        duration: {
            required: true,
            min: 1,
            max: 1440,
        },
        date: {
            required: true,
            date: true,
        },
    };

    useEffect(() => {
        if (!token) return navigate("/login");
        setLoading(true);
        
        get(`${import.meta.env.VITE_API_URL}workouts`, {
            headers: { Authorization: `Bearer ${token}` }
        }, 'workout')
            .then(data => {
                if (Array.isArray(data)) {
                    setWorkouts(data);
                } else {
                    setWorkouts([]);
                }
            })
            .catch(err => {
                if (err.message && err.message.toLowerCase().includes("nenhum treino")) {
                    setWorkouts([]);
                } else {
                    toast.error(err.message);
                }
            })
            .finally(() => setLoading(false));
    }, [token, navigate, get]);

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
            
            if (rules.required && !value) {
                fieldErrors.push('Campo obrigatório');
            }
            if (rules.minLength && value && value.length < rules.minLength) {
                fieldErrors.push(`Mínimo ${rules.minLength} caracteres`);
            }
            if (rules.maxLength && value && value.length > rules.maxLength) {
                fieldErrors.push(`Máximo ${rules.maxLength} caracteres`);
            }
            if (rules.min && value && Number(value) < rules.min) {
                fieldErrors.push(`Valor mínimo: ${rules.min}`);
            }
            if (rules.max && value && Number(value) > rules.max) {
                fieldErrors.push(`Valor máximo: ${rules.max}`);
            }
            if (rules.date && value && !isValidDate(value)) {
                fieldErrors.push('Data inválida');
            }
            
            if (fieldErrors.length > 0) {
                setErrors({ ...errors, [name]: fieldErrors[0] });
            }
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
            const workoutData = {
                ...form,
                duration: Number(form.duration)
            };
            
            if (editing) {
                const data = await put(
                    `${import.meta.env.VITE_API_URL}workouts/${editing}`,
                    workoutData,
                    { Authorization: `Bearer ${token}` },
                    'workout'
                );
                setWorkouts(workouts.map(w => w.id === editing ? data : w));
                toast.success("✅ Treino editado com sucesso!");
                setEditing(null);
            } else {
                const data = await post(
                    `${import.meta.env.VITE_API_URL}workouts`,
                    workoutData,
                    { Authorization: `Bearer ${token}` },
                    'workout'
                );
                setWorkouts([...workouts, data]);
                toast.success("✅ Treino criado com sucesso!");
            }
            setForm({ name: "", description: "", duration: "", date: "" });
            setErrors({});
        } catch (err) {
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

    function handleDeleteRequest(id) {
        setDeleteId(id);
        setModalOpen(true);
    }

    async function handleDeleteConfirmed() {
        setModalOpen(false);
        if (!deleteId) return;
        setLoading(true);
        try {
            await del(
                `${import.meta.env.VITE_API_URL}workouts/${deleteId}`,
                { Authorization: `Bearer ${token}` },
                'workout'
            );
            setWorkouts(workouts.filter(w => w.id !== deleteId));
            toast.success("✅ Treino excluído com sucesso!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleteId(null);
            setLoading(false);
        }
    }

    function handleLogout() {
        setLoading(true);
        localStorage.removeItem("token");
        toast.success("Logout realizado com sucesso!");
        setTimeout(() => {
            setLoading(false);
            navigate("/login");
        }, 500); 
    }

    if (loading) return <Loader />;

    return (
        <div className="workouts-container">
            <button 
                onClick={handleLogout} 
                disabled={saving || loading}
                style={{
                    position: "fixed",
                    top: "1.5rem",
                    right: "1.5rem"
                }}
            >
                Sair
            </button>
            <h2>Seus treinos</h2>
            <div className="workouts-card">
                <h3 style={{ 
                    marginBottom: "1.5rem", 
                    textAlign: "center",
                    fontSize: "1.5rem"
                }}>{editing ? "Editar Treino" : "Novo Treino"}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Nome do treino"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.name ? 'error' : ''}
                        required
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                    
                    <textarea
                        name="description"
                        placeholder="Descrição"
                        value={form.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.description ? 'error' : ''}
                        required
                        rows={3}
                        style={{
                            resize: "vertical",
                            minHeight: "80px",
                            fontFamily: "inherit"
                        }}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                    
                    <input
                        name="duration"
                        type="number"
                        placeholder="Duração (minutos)"
                        value={form.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.duration ? 'error' : ''}
                        required
                        min="1"
                    />
                    {errors.duration && <span className="error-message">{errors.duration}</span>}
                    
                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.date ? 'error' : ''}
                        required
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" disabled={saving} style={{ flex: 1 }}>
                            {saving ? "Salvando..." : (editing ? "Salvar" : "Adicionar")}
                        </button>
                        {editing && (
                            <button 
                                type="button" 
                                onClick={handleCancelEdit}
                                className="secondary"
                                style={{ flex: 0.4 }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div className="workout-list">
                {workouts.length === 0 ? (
                    <p style={{ 
                        fontSize: "1.1rem",
                        padding: "3rem 2rem"
                    }}>
                        Você ainda não possui treinos cadastrados.<br/>
                        <span style={{ fontSize: "0.95rem", opacity: 0.8 }}>Comece adicionando seu primeiro treino acima!</span>
                    </p>
                ) : (
                    workouts.map(w => (
                        <WorkoutCard
                            key={w.id}
                            workout={w}
                            onDelete={() => handleDeleteRequest(w.id)}
                            onEdit={handleEditClick}
                        />
                    ))
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