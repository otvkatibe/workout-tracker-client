export default function WorkoutCard({ workout, onDelete, onEdit }) {
  return (
    <div className="workout-card">
      <h3>{workout.title}</h3>
      <p>{workout.description}</p>
      <span>Duração: {workout.duration} min</span>
      <div className="workout-actions">
        <button onClick={() => onEdit(workout)}>Editar</button>
        <button onClick={() => onDelete(workout._id)}>Excluir</button>
      </div>
    </div>
  );
}