"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import cloudinary from "../_lib/cloudinary";

export const deleteService = async (serviceId: string, oldImagePublicId: string | null, professionalId: string) => {
    
    // Remove a imagem do cloudinary
    if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
    }

    await db.servico.delete({
        where: {
            id: serviceId
        },
    })

    revalidatePath(`/admin/service/${professionalId}`)
}