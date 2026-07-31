"use server"

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { startOfDay } from "date-fns";

interface CreateDisponibilidadeProps {
  professionalId: string;
  selectedDay: Date;
  horaInicio: string; // "08:00"
  horaFim: string;    // "18:00"
  intervalo: number;  // 30 (minutos)
  horaInicioIntervalo?: string; // "11:30"
  horaFimIntervalo?: string;    // "13:30"
}

export const createDisponibilidade = async ({
  professionalId,
  selectedDay,
  horaInicio,
  horaFim,
  intervalo,
  horaInicioIntervalo,
  horaFimIntervalo,
}: CreateDisponibilidadeProps) => {
  const data = startOfDay(selectedDay);

  // Converte os horários para minutos desde meia-noite
  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const inicioMin = parseTime(horaInicio);
  const fimMin = parseTime(horaFim);

  // Converte intervalo de almoço (se informado)
  let inicioIntervaloMin: number | null = null;
  let fimIntervaloMin: number | null = null;

  if (horaInicioIntervalo && horaFimIntervalo) {
    inicioIntervaloMin = parseTime(horaInicioIntervalo);
    fimIntervaloMin = parseTime(horaFimIntervalo);
  }

  // Gera os slots
  const slots: { data: Date; horaInicio: Date; horaFim: Date }[] = [];

  let minutos = inicioMin;

  while (minutos < fimMin) {
    const slotFimMin = minutos + intervalo;

    // Verifica se o slot INVADE o intervalo de almoço
    // Um slot invade se: início do slot < fim do intervalo E fim do slot > início do intervalo
    const invadeIntervalo =
      inicioIntervaloMin !== null &&
      fimIntervaloMin !== null &&
      minutos < fimIntervaloMin &&
      slotFimMin > inicioIntervaloMin;

    if (invadeIntervalo) {
      // Pula para o final do intervalo e cria o próximo slot a partir daí
      minutos = fimIntervaloMin!;
      continue;
    }

    const slotInicio = new Date(data);
    slotInicio.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);

    const slotFim = new Date(slotInicio);
    slotFim.setMinutes(slotFim.getMinutes() + intervalo);

    slots.push({
      data,
      horaInicio: slotInicio,
      horaFim: slotFim,
    });

    minutos += intervalo;
  }

  // Remove slots já existentes para esta data
  await db.disponibilidade.deleteMany({
    where: {
      profissionalId: professionalId,
      data,
    },
  });

  // Cria os registros no banco
  if (slots.length > 0) {
    await db.disponibilidade.createMany({
      data: slots.map((slot) => ({
        data: slot.data,
        horaInicio: slot.horaInicio.toISOString(),
        horaFim: slot.horaFim.toISOString(),
        profissionalId: professionalId,
        status: "LIVRE",
      })),
    });
  }

  revalidatePath(`/admin/professionals`);
};