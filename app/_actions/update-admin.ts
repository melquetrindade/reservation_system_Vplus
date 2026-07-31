"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'

export const updateAdmin = async (formData: FormData, adminId: string) => {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;

    // Verifica se já existe outro administrador com o mesmo email (excluindo o próprio)
    const hasAdmin = await db.administrador.findFirst({
        where: {
            email: email,
            NOT: {
                id: adminId
            }
        }
    })

    if(hasAdmin){
        throw new Error('Já existe um administrador cadastrado com este email!')
    }

    // Dados que serão atualizados
    const updateData: any = {
        nome: nome,
        email: email,
    };

    const upAdmin = await db.administrador.update({
        where: {
            id: adminId
        },
        data: updateData
    })

    revalidatePath('/admin/owners')
    return upAdmin
}