export default function WorkoutCard({ workout, onDelete, onEdit, style }) {
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
    <div
      className="glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/50 animate-[fade-scale_0.4s_ease-out_backwards]"
      style={style}
    >
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-1 break-words">{workout.name}</h3>
        <p className="text-text-secondary text-sm leading-relaxed break-words whitespace-pre-wrap">{workout.description}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {workout.duration} min
        </span>
        {workout.date && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(workout.date)}
          </span>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-glass-border">
        <button
          onClick={() => onEdit(workout)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg bg-primary/10 border border-primary/30 text-primary-light transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
        <button
          onClick={() => onDelete(workout.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg bg-danger/10 border border-danger/30 text-danger transition-all duration-300 hover:bg-danger hover:text-white hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Excluir
        </button>
      </div>
    </div>
  );
}