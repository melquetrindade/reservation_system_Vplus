"use client";

import {
  getAgendamentosConclude,
  getAgendamentosConfirmad,
} from "@/app/_actions/get-agendamentos-confirmad";
import { Prisma } from "@prisma/client";
import { isFuture, isPast } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import AgendamentoItem from "./agendamentos-item";
import { Skeleton } from "../ui/skeleton";

type AgendamentoComIncludes = Prisma.AgendamentoGetPayload<{
  include: {
    servico: true;
    disponibilidade: {
      include: {
        profissional: true;
      };
    };
  };
}>;

const ContainerPageAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoComIncludes[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const agendamentosFuturos = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      return isFuture(new Date(agendamento.disponibilidade.horaInicio));
    });
  }, [agendamentos]);

  const agendamentosPassados = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      return isPast(new Date(agendamento.disponibilidade.horaInicio));
    });
  }, [agendamentos]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [futurosData, passadosData] = await Promise.all([
        getAgendamentosConfirmad(),
        getAgendamentosConclude(),
      ]);
      const todos = [...futurosData, ...passadosData];
      setAgendamentos(todos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleAgendamentoCancelado = () => {
        fetchData()
    }
    window.addEventListener("agendamentoCancelado", handleAgendamentoCancelado)
    return () => window.removeEventListener("agendamentoCancelado", handleAgendamentoCancelado)
  }, [])

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Agendamentos</h1>

      {loading ? (
        <>
          <Skeleton className="mb-3 mt-6 h-4 w-35 uppercase bg-secondary" />
          <div className="gap-3 flex flex-col">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between min-w-[90%] bg-secondary rounded-sm"
              >
                <div className="flex h-15 w-10 flex-col items-center gap-2"></div>
              </div>
            ))}
          </div>
        </>
      ) : agendamentos.length === 0 ? (
        <p className="mt-3 text-xs font-bold uppercase text-gray-400">Nenhum agendamento encontrado</p>
      ) : (
        <>
          {agendamentosFuturos.length > 0 && (
            <>
              <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
                Confirmados
              </h2>
              <div className="flex flex-col gap-3">
                {agendamentosFuturos.map((agendamento) => (
                  <AgendamentoItem
                    key={agendamento.id}
                    agendamento={agendamento}
                  />
                ))}
              </div>
            </>
          )}

          {agendamentosPassados.length > 0 && (
            <>
              <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-500">
                Concluídos
              </h2>
              <div className="flex flex-col gap-3">
                {agendamentosPassados.map((agendamento) => (
                  <AgendamentoItem
                    key={agendamento.id}
                    agendamento={agendamento}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContainerPageAgendamentos;