"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'

export const updatePerfilUser = async (formData: FormData, userId: string) => {
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;

    if (telefone) {
        const hasPhone = await db.user.findFirst({
            where: {
                telefone: telefone,
                NOT: {
                    id: userId
                }
            }  
        })

        if(hasPhone){
            throw new Error('Já existe um cliente cadastrado com este telefone!')
        }
    }

    const upPhone = await db.user.update({
        where: {
            id: userId
        },
        data: {
            name: nome,
            telefone: telefone || null,
        }
    })

    revalidatePath('/')
    return upPhone
}
