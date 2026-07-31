"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'

export const desactivedService = async (serviceId: string, action: boolean, professionalId: string) => {
    // Dados que serão atualizados
    const updateData: any = {
        ativo: action
    };

    await db.servico.update({
        where: {
            id: serviceId
        },
        data: updateData
    })
    revalidatePath(`/admin/service/${professionalId}`)
}