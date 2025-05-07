export default function EditWorkoutForm({ editForm, setEditForm, onSave }) {
  return (
    <div>
      <h3>Editar Treino</h3>
      <input
        type="text"
        placeholder="Tipo de treino"
        value={editForm.type}
        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({ ...editForm, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Duração (minutos)"
        value={editForm.duration}
        onChange={(e) =>
          setEditForm({ ...editForm, duration: e.target.value })
        }
      />
      <button onClick={() => onSave(editForm._id)}>Salvar</button>
      <button onClick={() => setEditForm(null)}>Cancelar</button>
    </div>
  );
}