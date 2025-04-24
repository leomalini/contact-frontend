import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData } from "../types/auth.type";
import { RegisterSchema } from "../schemas/auth-schema";
import { register as registerService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError("");
      await registerService(data.name, data.email, data.password);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error;
        if (
          error.response?.status === 409 &&
          errorMessage === "Email already registered"
        ) {
          setRegisterError("Este email já está cadastrado");
        } else {
          setRegisterError(
            errorMessage || "Erro ao realizar o registro. Tente novamente."
          );
        }
      } else {
        setRegisterError("Erro ao realizar o registro. Tente novamente.");
      }
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-medium text-white mb-8 text-center">
          Registro
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registerError && (
            <p className="text-red-400 text-sm text-center">{registerError}</p>
          )}
          <div>
            <label className="block text-white mb-2">Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full p-2 rounded bg-white"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Email:</label>
            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full p-2 rounded bg-white"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Senha:</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full p-2 rounded bg-white"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white mb-2">Confirme sua senha:</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full p-2 rounded bg-white"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Registrar
          </button>

          <p className="text-white text-center">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300"
            >
              Faça login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
