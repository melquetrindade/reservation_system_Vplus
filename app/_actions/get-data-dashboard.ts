"use server"

import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import {db} from '../_lib/prisma'

// Quantidade de agendamentos para hoje (Mostra a quantidade de pendentes)
// &&
// Receita prevista para o dia (Mostra a quantidade de agendamentos para hoje)
export const getAgendamentosHoje = async () => {
    const agendamentos = await db.agendamento.findMany({
            where: {
                disponibilidade: {
                    data: {
                        gte: startOfDay(new Date()),
                        lte: endOfDay(new Date()),
                    },
                },
            },
            include: {
                disponibilidade: true,
                servico: true
            },
        });
    return agendamentos.map((a) => ({
        ...a,
        servico: {
            ...a.servico,
            preco: Number(a.servico.preco),
        },
    }))
}

// Quantidade de horários livres para hoje
export const getHorariosLivresHoje = async () => {
    const horariosLivre = await db.disponibilidade.findMany({
            where: {
                data: {
                    gte: startOfDay(new Date()),
                    lte: endOfDay(new Date()),
                },
                status: "LIVRE"
            }
        });
    return horariosLivre
}

// Receita do mês atual
// &&
// Serviços mais vendidos (EX: mostrar um top-3)
export const getAgendamentosMes = async () => {
    const agendamentosDoMes = await db.agendamento.findMany({
            where: {
                disponibilidade: {
                    data: {
                        gte: startOfMonth(new Date()),
                        lte: endOfMonth(new Date()),
                    },
                },
            },
            include: {
                disponibilidade: true,
                servico: true
            },
        });
    return agendamentosDoMes.map((a) => ({
        ...a,
        servico: {
            ...a.servico,
            preco: Number(a.servico.preco),
        },
    }))
}