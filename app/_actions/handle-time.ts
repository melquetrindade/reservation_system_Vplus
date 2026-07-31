"use server"

import { revalidatePath } from 'next/cache';
import {db} from '../_lib/prisma'

export const blockTime = async (id: string, professionalId: string) => {
    const upTime = await db.disponibilidade.update({
        where: {
            id: id
        },
        data: {
            status: "BLOQUEADO"
        }
    })
    revalidatePath(`/admin/calendar/${professionalId}`)
    return {
        ...upTime,
        agendamentos: [] as any[]
    }
}

export const unlockTime = async (id: string, professionalId: string) => {
    const upTime = await db.disponibilidade.update({
        where: {
            id: id
        },
        data: {
            status: "LIVRE"
        }
    })
    revalidatePath(`/admin/calendar/${professionalId}`)
    return {
        ...upTime,
        agendamentos: [] as any[]
    }
}
