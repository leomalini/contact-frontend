import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData } from "../types/auth.type";
import { LoginSchema } from "../schemas/auth-schema";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-medium text-white mb-8 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>

          <p className="text-white text-center">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:text-blue-300"
            >
              Registre-se
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
