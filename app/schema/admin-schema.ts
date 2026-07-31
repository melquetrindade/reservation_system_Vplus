import { z } from "zod";

export const adminSchema = z.object({
    nome: z.string().transform((value) => value.trim().replace(/\s+/g, " "))
    .refine((value) => value.length >= 3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),

    email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => !/\s/.test(value), {
        message: "O e-mail não pode conter espaços.",
    })
    .email({
        message: "Informe um endereço de e-mail válido.",
    })

});

export type AdminSchema = z.infer<typeof adminSchema>;
