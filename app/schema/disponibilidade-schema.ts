import { z } from "zod";

export const disponibilidadeSchema = z
  .object({
    horaInicio: z
      .string()
      .min(1, "Selecione o horário inicial."),

    horaFim: z
      .string()
      .min(1, "Selecione o horário final."),

    intervalo: z
      .number({
        message: "Informe o intervalo.",
      })
      .min(5, "O intervalo deve ser de pelo menos 5 minutos."),

    horaInicioIntervalo: z.string().optional(),
    horaFimIntervalo: z.string().optional(),
  })
  .refine(
    (data) => {
      const [horaInicio, minutoInicio] = data.horaInicio
        .split(":")
        .map(Number);

      const [horaFim, minutoFim] = data.horaFim
        .split(":")
        .map(Number);

      const inicioEmMinutos = horaInicio * 60 + minutoInicio;
      const fimEmMinutos = horaFim * 60 + minutoFim;

      return fimEmMinutos > inicioEmMinutos;
    },
    {
      message: "O horário final deve ser maior que o horário inicial.",
      path: ["horaFim"],
    }
  )
  .refine(
    (data) => {
      // Se um dos campos de intervalo foi preenchido, o outro também deve ser
      if (data.horaInicioIntervalo || data.horaFimIntervalo) {
        return !!data.horaInicioIntervalo && !!data.horaFimIntervalo;
      }
      return true;
    },
    {
      message: "Preencha o início e o fim do intervalo de almoço.",
      path: ["horaInicioIntervalo"],
    }
  )
  .refine(
    (data) => {
      if (!data.horaInicioIntervalo || !data.horaFimIntervalo) return true;

      const [horaInicio, minutoInicio] = data.horaInicioIntervalo
        .split(":")
        .map(Number);

      const [horaFim, minutoFim] = data.horaFimIntervalo
        .split(":")
        .map(Number);

      const inicioEmMinutos = horaInicio * 60 + minutoInicio;
      const fimEmMinutos = horaFim * 60 + minutoFim;

      return fimEmMinutos > inicioEmMinutos;
    },
    {
      message: "O fim do intervalo deve ser maior que o início.",
      path: ["horaFimIntervalo"],
    }
  );

export type DisponibilidadeForm = z.infer<typeof disponibilidadeSchema>;