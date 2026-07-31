"use server"

import {db} from '../_lib/prisma'

export const createPhone = async (formData: FormData, userId: string) => {
    const telefone = formData.get("telefone") as string;

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

    const upPhone = await db.user.update({
        where: {
            id: userId
        },
        data: {
            telefone: telefone,
        }
    })

    return upPhone.telefone
}
