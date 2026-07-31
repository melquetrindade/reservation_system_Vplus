"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import { getBarbearia } from './get-barbearia'

export const createAdmin = async (formData: FormData) => {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;

    const hasAdmin = await db.administrador.findUnique({
        where: {
            email: email
        }
    })

    if(hasAdmin){
        throw new Error('Já existe um administrador cadastrado com este email!')
    }

    const barbeariaID = await getBarbearia()

    if (!barbeariaID?.id) {
        throw new Error('Barbearia não encontrada!')
    }

    const newAdmin= await db.administrador.create({
        data: {
            nome: nome,
            email: email,
            barbeariaId: barbeariaID.id,
            role: "ADMIN"
        }
    })

    revalidatePath('/admin/owners')
    return newAdmin
}
