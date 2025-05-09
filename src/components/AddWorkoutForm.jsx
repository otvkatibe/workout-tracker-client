import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  type: yup.string().required("O tipo é obrigatório"),
  description: yup.string().required("A descrição é obrigatória"),
  duration: yup.number().positive("A duração deve ser positiva").required("A duração é obrigatória"),
});

export default function AddWorkoutForm({ onWorkoutAdded }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { token } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const body = {
        title: data.type,
        description: data.description,
        duration: data.duration,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao adicionar treino");
      toast.success("Treino adicionado com sucesso!");
      onWorkoutAdded();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "20px" }}>
      <h3>Adicionar Treino</h3>
      <input type="text" placeholder="Tipo de treino" {...register("type")} />
      <p>{errors.type?.message}</p>
      <input type="text" placeholder="Descrição" {...register("description")} />
      <p>{errors.description?.message}</p>
      <input type="number" placeholder="Duração (minutos)" {...register("duration")} />
      <p>{errors.duration?.message}</p>
      <button type="submit">Adicionar</button>
    </form>
  );
}