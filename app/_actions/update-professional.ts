"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import cloudinary from "../_lib/cloudinary";

export const updateProfessional = async (formData: FormData, professionalId: string, oldImagePublicId: string | null) => {
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;
    const imagem = formData.get("imagem") as File;

    // Verifica se já existe outro profissional com o mesmo telefone (excluindo o próprio)
    const hasProfessional = await db.profissional.findFirst({
        where: {
            telefone: telefone,
            NOT: {
                id: professionalId
            }
        }
    })

    if(hasProfessional){
        throw new Error('Já existe um profissional cadastrado com este telefone!')
    }

    // Dados que serão atualizados
    const updateData: any = {
        nome: nome,
        telefone: telefone,
    };

    // Se uma nova imagem foi enviada
    if (imagem && imagem.size > 0) {
        // Excluir a antiga imagem do cloudinary
        if (oldImagePublicId) {
            await cloudinary.uploader.destroy(oldImagePublicId);
        }

        // Upload da nova imagem
        const bytes = await imagem.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "profissionais",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                )
                .end(buffer);
        });

        updateData.imgURL = uploadResult.secure_url;
        updateData.imgURLPublicId = uploadResult.public_id;
    }

    const upProfessional = await db.profissional.update({
        where: {
            id: professionalId
        },
        data: updateData
    })

    revalidatePath('/admin/professionals')
    return upProfessional
}