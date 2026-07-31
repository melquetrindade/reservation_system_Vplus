"use server";

import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { startOfDay } from "date-fns";

export const getAgendamentosConfirmad = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return [];
  }

  const agendamentos = await db.agendamento.findMany({
    where: {
      usuarioId: session.user.id,
      disponibilidade: {
        data: {
          gte: startOfDay(new Date()),
        },
      },
    },
    include: {
      servico: true,
      disponibilidade: {
        include: {
          profissional: true,
        },
      },
    },
    orderBy: {
      disponibilidade: {
        horaInicio: "asc",
      },
    },
  });

  return agendamentos;
};

export const getAgendamentosConclude = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return [];
  }

  const agendamentos = await db.agendamento.findMany({
    where: {
      usuarioId: session.user.id,
      disponibilidade: {
        data: {
          lt: startOfDay(new Date()),
        },
      },
    },
    include: {
      servico: true,
      disponibilidade: {
        include: {
          profissional: true,
        },
      },
    },
    orderBy: {
      disponibilidade: {
        horaInicio: "asc",
      },
    },
  });

  return agendamentos;
};
