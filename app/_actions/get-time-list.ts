"use server"


import { DisponibilidadeStatus } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import {db} from '../_lib/prisma'

interface GetTimeListProps {
    professionalId: string,
    selectedDay: Date
}


export const getTimeList = async ({ professionalId, selectedDay }: GetTimeListProps) => {
    const horariosDisponiveis = await db.disponibilidade.findMany({
        where: {
            data: {
                gte: startOfDay(selectedDay),
                lte: endOfDay(selectedDay),
            },
            profissionalId: professionalId,
            status: DisponibilidadeStatus.LIVRE,
        },
        orderBy: {
            horaInicio: "asc",
        },
    });

    // Filtra horários no passado se o dia selecionado for hoje
    const agora = new Date();
    const hoje = new Date();
    const isHoje =
        selectedDay.getDate() === hoje.getDate() &&
        selectedDay.getMonth() === hoje.getMonth() &&
        selectedDay.getFullYear() === hoje.getFullYear();

    if (isHoje) {
        return horariosDisponiveis.filter((slot) => {
            const horaSlot = new Date(slot.horaInicio);
            return horaSlot > agora;
        });
    }

    return horariosDisponiveis
}