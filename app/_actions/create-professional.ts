"use server"

import { revalidatePath } from 'next/cache'
import {db} from '../_lib/prisma'
import { getBarbearia } from './get-barbearia'
import cloudinary from "../_lib/cloudinary";

export const createProfessional = async (formData: FormData) => {
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;
    const imagem = formData.get("imagem") as File;

    const hasProfessional = await db.profissional.findFirst({
        where: {
            telefone: telefone
        }
    })

    if(hasProfessional){
        throw new Error('Já existe um profissional cadastrado com este telefone!')
    }

    const barbeariaID = await getBarbearia()

    if (!barbeariaID?.id) {
        throw new Error('Barbearia não encontrada!')
    }

    // Upload da imagem
    let imageUrl: string | null = null;
    let imageUrlId: string | null = null;

    if (imagem) {
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

        imageUrl = uploadResult.secure_url;
        imageUrlId = uploadResult.public_id
    }

    const newProfessional = await db.profissional.create({
        data: {
            nome: nome,
            telefone: telefone,
            imgURL: imageUrl,
            imgURLPublicId: imageUrlId,
            barbeariaId: barbeariaID.id
        }
    })

    revalidatePath('/admin/professionals')
    return newProfessional
}
