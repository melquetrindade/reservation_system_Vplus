import { z } from "zod";

export const addHorarioSchema = z.object({
  horaInicio: z
    .string()
    .min(1, "Selecione o horário."),

  intervalo: z
    .number({
      message: "Informe a duração.",
    })
    .min(5, "A duração deve ser de pelo menos 5 minutos."),
});

export type AddHorarioForm = z.infer<typeof addHorarioSchema>;