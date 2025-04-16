import { z } from "zod";
import { ContactSchema } from "../schemas/contact-schema";

export interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
}

export type ContactFormData = z.infer<typeof ContactSchema>;
