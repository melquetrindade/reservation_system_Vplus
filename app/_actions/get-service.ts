"use server";

import { db } from "../_lib/prisma";

export const getServicesClient = async (professionalId: string) => {
  const services = await db.servico.findMany({
    where: {
      profissionalId: professionalId,
      ativo: true
    },
  });

  return services.map((service) => ({
    ...service,
    preco: Number(service.preco),
  }));
};

export const getServicesAdmin = async (professionalId: string) => {
  const services = await db.servico.findMany({
    where: {
      profissionalId: professionalId,
    },
  });

  return services.map((service) => ({
    ...service,
    preco: Number(service.preco),
  }));
};
