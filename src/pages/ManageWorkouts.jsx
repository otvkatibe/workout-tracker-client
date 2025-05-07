import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import BackButton from "../components/BackButton";
import WorkoutList from "../components/WorkoutComponent";
import EditWorkoutForm from "../components/EditWorkoutForm";
import { fetchWorkouts, updateWorkout, deleteWorkout } from "../utils/workoutApi";

export default function ManageWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const data = await fetchWorkouts(token);
      setWorkouts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      await updateWorkout(id, editForm, token);
      toast.success("Treino atualizado com sucesso!");
      setEditForm(null);
      loadWorkouts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este treino?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteWorkout(id, token);
      toast.success("Treino excluído com sucesso!");
      setWorkouts((prev) => prev.filter((workout) => workout._id !== id));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <BackButton />
      <h2>Gerenciar Treinos</h2>
      <WorkoutList workouts={workouts} onDelete={handleDelete} onEdit={setEditForm} />
      {editForm && (
        <EditWorkoutForm editForm={editForm} setEditForm={setEditForm} onSave={handleUpdate} />
      )}
    </div>
  );
}

export function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <p>Tem certeza que deseja excluir este treino?</p>
      <button onClick={onConfirm}>Sim</button>
      <button onClick={onCancel}>Não</button>
    </div>
  );
}