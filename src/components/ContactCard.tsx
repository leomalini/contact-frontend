import { FiTrash } from "react-icons/fi";
import { CustomerProps } from "../types/contact.type";

interface ContactProps extends CustomerProps {
  handleDeleteCustomer(id: string): Promise<void>;
}
export default function CardContact({
  createdAt,
  email,
  id,
  name,
  status,
  handleDeleteCustomer,
}: ContactProps) {
  return (
    <article
      key={id}
      className="bg-slate-200 p-2 rounded relative md:hover:scale-105 transition-all"
    >
      <p className="font-normal">
        <span className="font-medium">Nome: </span>
        {name}
      </p>
      <p className="font-normal">
        <span className="font-medium">Email: </span>
        {email}
      </p>
      <p className="font-normal">
        <span className="font-medium">Status: </span>
        {status ? "Ativo" : "Inativo"}
      </p>
      <p className="font-normal">
        <span className="font-medium">Criado em: </span>
        {new Date(createdAt).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>

      <button
        onClick={() => handleDeleteCustomer(id)}
        className="bg-red-500 size-7 flex items-center justify-center rounded-lg absolute -top-2 -right-2 p-1 hover:scale-125 transition-all hover:cursor-pointer"
      >
        <FiTrash size={18} color="FFF" />
      </button>
    </article>
  );
}
