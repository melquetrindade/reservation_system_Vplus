"use server"

import { revalidatePath } from "next/cache";
import cloudinary from "../_lib/cloudinary";
import { db } from "../_lib/prisma"

export const createService = async (formData: FormData, professionalId: string) => {
    const nome = formData.get("nome") as string;
    const precoRaw = formData.get("preco") as string;
    const descricao = formData.get("descricao") as string;
    const tempo = formData.get("tempo") as string;
    const imagem = formData.get("imagem") as File;

    // Converte "30,00" para "30.00" e depois para número
    const preco = Number(precoRaw.replace(",", "."));

    const hasServico = await db.servico.findFirst({
        where: {
            nome: {
                equals: nome,
                mode: "insensitive",
            },
            profissionalId: professionalId,
        },
    })

    if (hasServico) {
        throw new Error('Já existe um serviço cadastrado com este nome!')
    }

    // Upload da imagem
    let imageUrl: string | null = null;
    let imageUrlId: string | null = null;

    if (imagem && imagem.size > 0) {
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

        imageUrl = uploadResult.secure_url;
        imageUrlId = uploadResult.public_id
    }

    const newService = await db.servico.create({
        data: {
            nome: nome,
            preco: preco,
            descricao: descricao,
            tempo: tempo,
            imgURL: imageUrl,
            imgURLPublicId: imageUrlId,
            profissionalId: professionalId
        }
    })

    revalidatePath(`/admin/service/${professionalId}`)

    // Converte Decimal para number para poder passar ao Client Component
    return {
        ...newService,
        preco: Number(newService.preco)
    }
}
