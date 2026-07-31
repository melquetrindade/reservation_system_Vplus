"use server"

import { revalidatePath } from 'next/cache';
import cloudinary from '../_lib/cloudinary';
import {db} from '../_lib/prisma'

export const updateService = async (
    formData: FormData, 
    serviceId: string, 
    oldImagePublicId: string | null,
    professionalId: string
) => {

    const nome = formData.get("nome") as string;
    const precoRaw = formData.get("preco") as string;
    const descricao = formData.get("descricao") as string;
    const tempo = formData.get("tempo") as string;
    const imagem = formData.get("imagem") as File;

    // Converte "30,00" para "30.00" e depois para número
    const preco = Number(precoRaw.replace(",", "."));

    // Verifica se já existe outro serviço com o mesmo nome (excluindo o próprio)
    // OBS: Ajustar para ele considerar além de excluir ele mesmo, o profissional. Pois, ele ainda pode pegar serviços com o mesmo nome de outro profissional
    const hasService = await db.servico.findFirst({
        where: {
            nome: {
                equals: nome,
                mode: "insensitive"
            },
            profissionalId: professionalId,
            NOT: {
                id: serviceId
            }
        }
    })

    if(hasService){
        throw new Error('Já existe um serviço cadastrado com este nome!')
    }

    // Dados que serão atualizados
    const updateData: any = {
        nome: nome,
        preco: preco,
        descricao: descricao,
        tempo: tempo
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
                        folder: `profissionais/${professionalId}/servicos`,
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

    const upService = await db.servico.update({
        where: {
            id: serviceId
        },
        data: updateData
    })

    revalidatePath(`/admin/service/${professionalId}`)
    return {
        ...upService,
        preco: Number(upService.preco)
    }
}