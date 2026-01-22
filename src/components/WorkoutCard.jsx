export default function WorkoutCard({ workout, onDelete, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        marginTop: '0.5rem'
      }}>
        <span>Duração: {workout.duration} min</span>
        {workout.date && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {formatDate(workout.date)}
          </span>
        )}
      </div>
      <div className="workout-actions">
        <button onClick={() => onEdit(workout)}>Editar</button>
        <button onClick={() => onDelete(workout.id)} className="danger">Excluir</button>
      </div>
    </div>
  );
}