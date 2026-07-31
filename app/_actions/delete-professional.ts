"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import cloudinary from "../_lib/cloudinary";

export const deleteProfessional = async (professionalId: string, oldImagePublicId: string | null) => {
    
    // Busca o profissional com os serviços para deletar as imagens dos serviços também
    const professional = await db.profissional.findUnique({
        where: {
            id: professionalId
        },
        include: {
            servicos: {
                select: {
                    imgURLPublicId: true
                }
            }
        }
    })

    if (!professional) {
        throw new Error("Profissional não encontrado")
    }

    // Remove a imagem do profissional do cloudinary
    if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
    }

    // Remove as imagens dos serviços do cloudinary
    const serviceImagePublicIds = professional.servicos
        .map(servico => servico.imgURLPublicId)
        .filter((id): id is string => id !== null)

    if (serviceImagePublicIds.length > 0) {
        await Promise.all(
            serviceImagePublicIds.map(publicId => cloudinary.uploader.destroy(publicId))
        )
    }

    await db.profissional.delete({
        where: {
            id: professionalId
        },
    })

    revalidatePath('/admin/professionals')
}
