import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WorkoutCard from "../components/WorkoutCard";
import Loader from "../components/Loader";

export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: "", description: "", duration: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login");
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}workouts`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Erro ao buscar treinos");
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setWorkouts(data);
                } else {
                    setWorkouts([]);
                    toast.error(data.message || "Nenhum treino encontrado");
                }
            })
            .catch(err => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [token, navigate]);

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
        setSaving(true);
        try {
            if (editing) {
                // Edição
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
                // Criação
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
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    }

    function handleCancelEdit() {
        setEditing(null);
        setForm({ title: "", description: "", duration: "" });
    }

    async function handleDelete(id) {
        if (!window.confirm("Deseja excluir este treino?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}workouts/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Erro ao excluir treino");
            setWorkouts(workouts.filter(w => w._id !== id));
            toast.success("Treino excluído!");
        } catch (err) {
            toast.error(err.message);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (loading) return <Loader />;

    return (
        <div style={{
            minHeight: "100vh",
            minWidth: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <button onClick={handleLogout}>Logout</button>
            <h2>Seus treinos</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
                <input name="description" placeholder="Descrição" value={form.description} onChange={handleChange} required />
                <input name="duration" type="number" placeholder="Duração (min)" value={form.duration} onChange={handleChange} required />
                <button type="submit" disabled={saving}>
                    {saving ? (editing ? "Salvando..." : "Adicionando...") : (editing ? "Salvar edição" : "Adicionar treino")}
                </button>
                {editing && (
                    <button type="button" onClick={handleCancelEdit} style={{marginLeft: 8}}>
                        Cancelar
                    </button>
                )}
            </form>
            <div className="workout-list">
                {workouts.map(w => (
                    <WorkoutCard key={w._id} workout={w} onDelete={handleDelete} onEdit={handleEditClick} />
                ))}
            </div>
        </div>
    );
}