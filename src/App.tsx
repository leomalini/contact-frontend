import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "./services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ContactFormData, type CustomerProps } from "./types/contact.type";
import { ContactSchema } from "./schemas/contact-schema";
import Login from "./components/Login";
import Register from "./components/Register";
import Contact from "./components/Contact";
import { isAuthenticated, logout } from "./services/api";

function ProtectedRoute({ children }: PropsWithChildren) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

function AppContent() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  async function fetchData() {
    const response = await api.get("/customers");
    setCustomers(response.data);
  }

  async function onSubmit(data: ContactFormData) {
    try {
      const response = await api.post("/customer", data);
      setCustomers((prev) => [...prev, response.data]);
      reset();
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  }

  async function handleDeleteCustomer(id: string) {
    try {
      await api.delete(`/customer`, {
        params: { id },
      });
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-4xl font-medium text-white">Clientes</p>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            className="w-full mb-2 p-2 rounded bg-white"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mb-2">{errors.name.message}</p>
          )}

          <label className="font-medium text-white">Email:</label>
          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full mb-2 p-2 rounded bg-white"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mb-4">{errors.email.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            <Contact
              key={customer.id}
              {...customer}
              handleDeleteCustomer={handleDeleteCustomer}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
