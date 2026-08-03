"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { startOfDay } from "date-fns";

interface AddDisponibilidadeProps {
  professionalId: string;
  selectedDay: Date;
  horaInicio: string;
  intervalo: number;
}

export const addDisponibilidade = async ({
  professionalId,
  selectedDay,
  horaInicio,
  intervalo,
}: AddDisponibilidadeProps) => {
  const BRAZIL_TIMEZONE_OFFSET_MS = 3 * 60 * 60 * 1000;

  const toBrazilDate = (date: Date, hour: number, minute: number) => {
    const utcDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        hour,
        minute,
        0,
        0,
      ),
    );

    return new Date(utcDate.getTime() + BRAZIL_TIMEZONE_OFFSET_MS);
  };

  const data = startOfDay(selectedDay);

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const inicioMin = parseTime(horaInicio);
  const fimMin = inicioMin + intervalo;

  // Busca todos os horários já existentes para este dia e profissional
  const existingSlots = await db.disponibilidade.findMany({
    where: {
      profissionalId: professionalId,
      data,
    },
    select: {
      horaInicio: true,
      horaFim: true,
    },
  });

  const toLocalMinutesFromUtc = (date: Date) => {
    const utcHours = date.getUTCHours();
    const localHour = (utcHours - 3 + 24) % 24;
    return localHour * 60 + date.getUTCMinutes();
  };

  // Converte os horários existentes para intervalos em minutos
  const existingIntervals = existingSlots.map((slot) => {
    const hInicio = new Date(slot.horaInicio);
    const hFim = new Date(slot.horaFim);
    return {
      inicio: toLocalMinutesFromUtc(hInicio),
      fim: toLocalMinutesFromUtc(hFim),
    };
  });

  // Verifica se o novo horário conflita com algum existente
  const hasConflict = existingIntervals.some(
    (existing) => inicioMin < existing.fim && fimMin > existing.inicio,
  );

  if (hasConflict) {
    throw new Error(
      "Este horário conflita com um horário já existente (LIVRE, BLOQUEADO ou RESERVADO).",
    );
  }

  // Cria o slot
  const slotInicio = toBrazilDate(
    selectedDay,
    Math.floor(inicioMin / 60),
    inicioMin % 60,
  );

  const slotFim = new Date(slotInicio);
  slotFim.setMinutes(slotFim.getMinutes() + intervalo);

  await db.disponibilidade.create({
    data: {
      data,
      horaInicio: slotInicio.toISOString(),
      horaFim: slotFim.toISOString(),
      profissionalId: professionalId,
      status: "LIVRE",
    },
  });

  revalidatePath(`/admin/professionals`);
};