import { z } from "zod";

export const perfilUserSchema = z.object({
    nome: z.string().transform((value) => value.trim().replace(/\s+/g, " "))
       .refine((value) => value.length >= 3, {
          message: "O nome deve ter pelo menos 3 caracteres.",
    }), 

    telefone: z.string()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || value.length >= 10, {
         message: "Telefone inválido.",
      }),
});

export type PerfilUserSchema = z.infer<typeof perfilUserSchema>;
