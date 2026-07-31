"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'

export const desactivedProfessional = async (professionalId: string, action: boolean) => {
    // Dados que serão atualizados
    const updateData: any = {
        ativo: action
    };

    await db.profissional.update({
        where: {
            id: professionalId
        },
        data: updateData
    })
    revalidatePath('/admin/professionals')
}