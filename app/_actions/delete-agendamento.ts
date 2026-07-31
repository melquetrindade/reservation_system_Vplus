"use server"
import { Prisma } from '@prisma/client'
import {db} from '../_lib/prisma'
import { revalidatePath } from 'next/cache'

interface DeleteAgendamentoProps {
    agendamento: Prisma.AgendamentoGetPayload<{
        include: {
            servico: true,
            disponibilidade: {
                include: {
                    profissional: true,
                },
            },
        },
    }>
} 

export const deleteAgendamento = async ({agendamento}: DeleteAgendamentoProps) => {
    await db.disponibilidade.update({
        where: {
            id: agendamento.disponibilidadeId
        },
        data: {
            status: "LIVRE"
        }
    })
    
    await db.agendamento.delete({
        where: {
            id: agendamento.id
        }
    })

    revalidatePath("/agendamentos")
    revalidatePath("/")
}