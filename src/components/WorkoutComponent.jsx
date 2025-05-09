export default function WorkoutList({ workouts, onDelete, onEdit }) {
  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <div className="workout-card" key={workout._id}>
          <div>
            <h3>{workout.type || workout.title}</h3>
            <p>{workout.description}</p>
            <span>Duração: {workout.duration} min</span>
          </div>
          <div className="workout-actions">
            <button onClick={() => onEdit(workout)}>Editar</button>
            <button onClick={() => onDelete(workout._id)} className="danger">Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}