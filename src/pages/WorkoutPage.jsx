import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import Loading from "../components/Loading";
import BackButton from "../components/BackButton";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchWorkouts = async () => {
    setLoading(true); // Ativar carregamento
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}workouts`, "GET", null, token);
      setWorkouts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Desativar carregamento
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkouts();
    }
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <BackButton />
      <h2>Lista de Treinos</h2>
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <li key={workout._id}>
              <strong>{workout.title}</strong> - {workout.description} ({workout.duration} min)
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>Nenhum treino encontrado.</p>
          <button onClick={() => navigate("/add-workout")}>Adicionar Treino</button>
        </div>
      )}
    </div>
  );
}