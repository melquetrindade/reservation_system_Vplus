import { z } from "zod";

export const professionalSchema = z.object({
  nome: z.string().transform((value) => value.trim().replace(/\s+/g, " "))
    .refine((value) => value.length >= 3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),

  telefone: z.string().min(10, "Telefone inválido."),

  imagem: z
    .instanceof(File, {
      message: "Selecione uma imagem.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Formato de imagem inválido.",
      }
    )
    .refine((file) => file.size <= 9 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 9 MB.",
    }),
});

export type ProfessionalSchema = z.infer<typeof professionalSchema>;