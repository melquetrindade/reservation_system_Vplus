import { z } from "zod";

export const serviceSchema = z.object({
  nome: z.string().transform((value) => value.trim().replace(/\s+/g, " "))
    .refine((value) => value.length >= 3, {
      message: "O nome deve ter pelo menos 3 caracteres.",
    }),

  preco: z.string().min(1, "O preço é obrigatório."),

  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),

  tempo: z.string().min(3, "Tempo médio inválido."),

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

export type ServiceSchema = z.infer<typeof serviceSchema>;
