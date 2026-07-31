import { z } from "zod";

export const phoneClientSchema = z.object({
  telefone: z.string().min(10, "Telefone inválido."),
});

export type PhoneClientSchema = z.infer<typeof phoneClientSchema>;