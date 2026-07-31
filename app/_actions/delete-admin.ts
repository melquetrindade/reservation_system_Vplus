"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'

export const deleteAdmin = async (adminId: string) => {
    
    await db.administrador.delete({
        where: {
            id: adminId
        },
    })

    revalidatePath('/admin/owners')
}
