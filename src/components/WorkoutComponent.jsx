export default function WorkoutList({ workouts, onDelete, onEdit }) {
  return (
    <ul>
      {workouts.map((workout) => (
        <li key={workout._id}>
          <strong>{workout.type}</strong> - {workout.description} ({workout.duration} min)
          <button onClick={() => onDelete(workout._id)}>Excluir</button>
          <button onClick={() => onEdit(workout)}>Editar</button>
        </li>
      ))}
    </ul>
  );
}