"use server"

import { endOfDay, startOfDay } from 'date-fns'
import {db} from '../_lib/prisma'

interface GetBookingsProps {
    professionalId: string,
    date: Date
}

export const getAgendamentos = async ({date, professionalId}: GetBookingsProps) => {
    const agendamentos = await db.agendamento.findMany({
        where: {
            disponibilidade: {
                data: {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                },
                profissionalId: professionalId,
            },
        },
        include: {
            disponibilidade: true,
        },
    });
    return agendamentos
}