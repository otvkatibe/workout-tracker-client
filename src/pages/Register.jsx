import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao registrar");
      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h1>Cadastro</h1>
      <p>Crie sua conta para começar a gerenciar seus treinos.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Nome" {...register("name")} />
        <p>{errors.name?.message}</p>
        <input type="email" placeholder="Email" {...register("email")} />
        <p>{errors.email?.message}</p>
        <input type="password" placeholder="Senha" {...register("password")} />
        <p>{errors.password?.message}</p>
        <button type="submit">Cadastrar</button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Já tem uma conta?{" "}
        <Link to="/login" style={{ color: "#646cff", textDecoration: "none" }}>
          Faça login aqui
        </Link>
      </p>
      <p>
        <Link to="/" style={{ color: "#646cff", textDecoration: "none" }}>
          Voltar para a página inicial
        </Link>
      </p>
    </div>
  );
}