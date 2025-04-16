import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string({ required_error: "Campo obrigatório" })
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Email inválido"),
});
