import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "./services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormData, CustomerProps } from "./types/contact.type";
import Contact from "./components/contact";
import { ContactSchema } from "./schemas/contact-schema";

export default function App() {
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
      // Alternative 1: Try using axios directly
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
        <p className="text-4xl font-medium text-white mb-4">Clientes</p>

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
