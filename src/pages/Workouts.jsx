import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WorkoutCard from "../components/WorkoutCard";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import ConfirmModal from "../components/ConfirmModal";

function getFriendlyErrorMessage(message) {
    if (!message) return "Algo deu errado. Tente novamente.";
    if (message.includes("fetch")) return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    if (message.includes("401")) return "Sessão expirada. Faça login novamente.";
    if (message.includes("404")) return "Recurso não encontrado.";
    if (message.toLowerCase().includes("duration")) return "Informe uma duração válida para o treino.";
    if (message.toLowerCase().includes("title")) return "Informe um título para o treino.";
    if (message.toLowerCase().includes("description")) return "Informe uma descrição para o treino.";
    return message;
}

export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: "", description: "", duration: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const token = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login");
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}workouts`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    if (
                        data.message &&
                        data.message.toLowerCase().includes("nenhum treino encontrado")
                    ) {
                        setWorkouts([]);
                        return;
                    }
                    throw new Error(data.message || "Erro ao buscar treinos");
                }
                if (Array.isArray(data)) {
                    setWorkouts(data);
                } else {
                    setWorkouts([]);
                }
            })
            .catch(err => toast.error(getFriendlyErrorMessage(err.message)))
            .finally(() => setLoading(false));
    }, [token, navigate, setLoading]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleEditClick(workout) {
        setForm({
            title: workout.title,
            description: workout.description,
            duration: workout.duration
        });
        setEditing(workout._id);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.duration) {
            toast.error("Preencha todos os campos corretamente.");
            return;
        }

        setLoading(true);
        setSaving(true);
        try {
            if (editing) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}workouts/${editing}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        duration: Number(form.duration)
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erro ao editar treino");
                setWorkouts(workouts.map(w => w._id === editing ? data : w));
                toast.success("Treino editado!");
                setEditing(null);
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_URL}workouts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        duration: Number(form.duration)
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erro ao criar treino");
                setWorkouts([...workouts, data]);
                toast.success("Treino criado!");
            }
            setForm({ title: "", description: "", duration: "" });
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err.message));
        } finally {
            setSaving(false);
            setLoading(false);
        }
    }

    function handleCancelEdit() {
        setEditing(null);
        setForm({ title: "", description: "", duration: "" });
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}workouts/${deleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Não foi possível excluir o treino.");
            setWorkouts(workouts.filter(w => w._id !== deleteId));
            toast.success("Treino excluído com sucesso!");
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err.message));
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
            <button onClick={handleLogout} disabled={saving || loading}>Logout</button>
            <h2>Seus treinos</h2>
            <div className="workouts-card">
                <form onSubmit={handleSubmit}>
                    <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
                    <input name="description" placeholder="Descrição" value={form.description} onChange={handleChange} required />
                    <input name="duration" type="number" placeholder="Duração (min)" value={form.duration} onChange={handleChange} required />
                    <button type="submit" disabled={saving}>
                        {saving ? (editing ? "Salvando..." : "Adicionando...") : (editing ? "Salvar edição" : "Adicionar treino")}
                    </button>
                    {editing && (
                        <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
            <div className="workout-list">
                {workouts.length === 0 ? (
                    <p style={{ opacity: 0.7, marginTop: 24 }}>Você ainda não possui treinos cadastrados.</p>
                ) : (
                    workouts.map(w => (
                        <WorkoutCard
                            key={w._id}
                            workout={w}
                            onDelete={() => handleDeleteRequest(w._id)}
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