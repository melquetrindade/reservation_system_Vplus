"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'

interface CreateBookingParams {
    servicoId: string,
    disponibilidadeId: string
}

export const createAgendamento = async (params: CreateBookingParams) => {
    const user = await getServerSession(authOptions)
    if(!user){
        throw new Error("Usuário não autenticado!")
    }

    const service = await db.servico.findUnique({
        where: {
            id: params.servicoId
        }
    })

    if (!service) {
        throw new Error('Serviço não encontrado')
    }

    const disponibilidade = await db.disponibilidade.findUnique({
        where: {
            id: params.disponibilidadeId
        }
    })

    if (!disponibilidade) {
        throw new Error('Horário não encontrado')
    }

    await db.disponibilidade.update({
        where: {
            id: params.disponibilidadeId
        },
        data: {
            status: 'RESERVADO'
        }
    })

    await db.agendamento.create({
        data: {
            usuarioId: user.user.id, 
            servicoId: params.servicoId, 
            disponibilidadeId: params.disponibilidadeId
        }
    })

    revalidatePath(`/services/${service.profissionalId}`)
    revalidatePath('/')
}