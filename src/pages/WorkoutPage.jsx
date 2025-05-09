import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import Loading from "../components/Loading";
import BackButton from "../components/BackButton";
import AddWorkoutForm from "../components/AddWorkoutForm";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}workouts`, "GET", null, token);
      if (data.length > 0) {
        setWorkouts(data);
      } else {
        toast.info("Nenhum treino encontrado.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      <AddWorkoutForm onWorkoutAdded={fetchWorkouts} />
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <li key={workout._id}>
              <strong>{workout.title}</strong> - {workout.description} ({workout.duration} min)
            </li>
          ))}
        </ul>
      )
        : (
          <p>Nenhum treino encontrado.</p>
        )}
    </div>
  );
}
