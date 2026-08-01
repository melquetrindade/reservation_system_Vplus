"use client"

import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import { Barbearia, Profissional, Prisma } from "@prisma/client";
import { isFuture } from "date-fns";
import { getBarbearia } from "@/app/_actions/get-barbearia";
import { getProfessionalsClient } from "@/app/_actions/get-professionals";
import ProfessionalItem from "./professional-item";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getAgendamentosConfirmad } from "@/app/_actions/get-agendamentos-confirmad";
import AgendamentoItem from "./agendamentos-item";

type AgendamentoComIncludes = Prisma.AgendamentoGetPayload<{
    include: {
        servico: true,
        disponibilidade: {
            include: {
                profissional: true,
            },
        },
    },
}>

const ContainerPageInitial = () => {
    const {data} = useSession()
    const pathname = usePathname()
    const [barbearia, setBarbearia] = useState<Barbearia>()
    const [professionals, setProfessionals] = useState<Profissional[]>([])
    const [agendamentos, setAgendamentos] = useState<AgendamentoComIncludes[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingAgendamentos, setLoadingAgendamentos] = useState(false)

    const agendamentosFuturos = useMemo(() => {
        return agendamentos.filter((agendamento) => {
            return isFuture(new Date(agendamento.disponibilidade.horaInicio))
        })
    }, [agendamentos])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [barbeariaData, professionalsData] = await Promise.all([
                getBarbearia(),
                getProfessionalsClient(),
            ])
            setBarbearia(barbeariaData!)
            setProfessionals(professionalsData)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchAgendamentos = async () => {
        try{
            setLoadingAgendamentos(true)
            const agendamentosConfirmad = await getAgendamentosConfirmad()
            setAgendamentos(agendamentosConfirmad)
        } finally {
            setLoadingAgendamentos(false)
        }
    }

    useEffect(() => {
        if(data?.user?.id){
            fetchAgendamentos()
        }
    },[data?.user?.id])

    // Recarrega agendamentos sempre que o usuário navegar para a página inicial
    useEffect(() => {
        if(pathname === "/" && data?.user?.id){
            fetchAgendamentos()
        }
    },[pathname, data?.user?.id])

    // Recarrega agendamentos quando um agendamento for cancelado
    useEffect(() => {
        const handleAgendamentoCancelado = () => {
            if(data?.user?.id){
                fetchAgendamentos()
            }
        }
        window.addEventListener("agendamentoCancelado", handleAgendamentoCancelado)
        return () => window.removeEventListener("agendamentoCancelado", handleAgendamentoCancelado)
    },[data?.user?.id])

    return (
        <div className="p-5">
            {/* Banner da barbearia */}
            <div className="h-55 w-full flex justify-center lg:w-full lg:h-70 lg:justify-start">
                {loading || !barbearia ? (
                    <Skeleton className="h-full w-full rounded-xl bg-secondary lg:w-[50%]"/>
                ) : (
                    <div className="relative flex h-full w-full items-end lg:w-[50%]">
                        <Image
                            alt={'Foto da barbearia'}
                            src={barbearia.imgURL!}
                            fill
                            className="rounded-xl object-cover object-top"
                        />

                        <Card className="z-50 mx-5 mb-3 w-full rounded-xl bg-secondary/80">
                            <CardContent className="flex items-center gap-3 px-5">
                                <div>
                                    <h3 className="font-bold">{barbearia.nome}</h3>
                                    <p className="text-xs">{barbearia.endereco}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/*Agendamentos Confirmados */}
            {loadingAgendamentos ? (
                <>
                    <Skeleton className="mb-3 mt-6 h-4 w-34 uppercase bg-secondary rounded-sm"/>
                    <div className="gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="flex justify-between min-w-[90%] bg-secondary rounded-sm">
                                <div className="flex h-15 w-10 flex-col items-center gap-2">
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : agendamentosFuturos.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Agendamentos
                    </h2>
                    <div className="gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {agendamentosFuturos.map(agendamento => (
                            <AgendamentoItem key={agendamento.id} agendamento={agendamento}/>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Profissionais */}
            {loading ? (
                <>
                    <Skeleton className="mb-3 mt-6 h-4 w-34 uppercase bg-secondary" />
                    <div className="flex gap-9 overflow-auto mb-10 [&::-webkit-scrollbar]:hidden">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-30">
                                <Skeleton className="h-35 w-30 bg-secondary" />
                                <Skeleton className="h-3 w-20 bg-secondary" />
                                <Skeleton className="h-3 w-30 bg-secondary" />
                            </div>
                        ))}
                    </div>
                </>
            ) : professionals.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Profissionais
                    </h2>
                    <div className="grid grid-cols-2 gap-6 mb-10 lg:grid-cols-4">
                    {
                        professionals.map((professional) => <ProfessionalItem key={professional.id} professional={professional}/>)
                    }
                    </div>
                </>
                 
            ) : (
                <h2 className="mt-6 flex justify-center text-xs font-bold uppercase text-gray-400">Esta barbearia ainda não possui profissionais</h2>
            )}
        </div>
    );
}
 
export default ContainerPageInitial;