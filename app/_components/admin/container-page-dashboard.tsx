"use client"

import { getAgendamentosHoje, getAgendamentosMes, getHorariosLivresHoje } from "@/app/_actions/get-data-dashboard";
import { Disponibilidade } from "@prisma/client";
import { isFuture } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { CalendarIcon, ClockPlusIcon, DollarSignIcon, TrendingUpIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface AgendamentoComServico {
    id: string;
    status: string;
    usuarioId: string;
    servicoId: string;
    disponibilidadeId: string;
    createdAt: Date;
    updatedAt: Date;
    servico: {
        id: string;
        nome: string;
        descricao: string | null;
        tempo: string | null;
        imgURL: string | null;
        imgURLPublicId: string | null;
        preco: number;
        ativo: boolean;
        profissionalId: string;
        createdAt: Date;
        updatedAt: Date;
    };
    disponibilidade: Disponibilidade;
}

interface TopServico {
  servicoId: string;
  nome: string;
  quantidadeAtendimentos: number;
  valorTotal: number;
}

const ContainerPageDashboard = () => {
    const [agendamentosHJ, setAgendamentoHJ] = useState<AgendamentoComServico[]>([])
    const [agendamentosMES, setAgendamentoMES] = useState<AgendamentoComServico[]>([])
    const [horariosLivresHJ, setHorariosLivresHJ] = useState<Disponibilidade[]>([])
    const [loading, setLoading] = useState(false)

    const agendamentosPendentes = useMemo(() => {
        return agendamentosHJ.filter((agendamento) => {
          return isFuture(new Date(agendamento.disponibilidade.horaInicio));
        });
    }, [agendamentosHJ]);

    const horariosFuturoLivres = useMemo(() => {
        return horariosLivresHJ.filter((horarios) => {
          return isFuture(new Date(horarios.horaInicio));
        });
    }, [horariosLivresHJ]);

    const receitaHoje = useMemo(() => {
        return agendamentosHJ.reduce(
            (total, agendamento) =>
                total + Number(agendamento.servico.preco),
            0
        )
    }, [agendamentosHJ])

    const receitaMes = useMemo(() => {
        return agendamentosMES.reduce(
            (total, agendamento) =>
                total + Number(agendamento.servico.preco),
            0
        )
    }, [agendamentosMES])

    const top3Servicos = useMemo(() => {
        const ranking = new Map<string, TopServico>();

        for (const agendamento of agendamentosMES) {
            const servico = agendamento.servico;

            const existente = ranking.get(servico.id);

            if (existente) {
                existente.quantidadeAtendimentos += 1;
                existente.valorTotal += servico.preco;
            } else {
                ranking.set(servico.id, {
                    servicoId: servico.id,
                    nome: servico.nome,
                    quantidadeAtendimentos: 1,
                    valorTotal: servico.preco,
                });
            }
        }

        return [...ranking.values()]
            .sort((a, b) => b.quantidadeAtendimentos - a.quantidadeAtendimentos)
            .slice(0, 3);

    }, [agendamentosMES])

    const fetchData = async () => {
        try{
            setLoading(true)
            const [agendamentosHoje, horariosLivresHoje, agendamentosMes] = await Promise.all([
                getAgendamentosHoje(),
                getHorariosLivresHoje(),
                getAgendamentosMes(),
            ])
            setAgendamentoHJ(agendamentosHoje)
            setHorariosLivresHJ(horariosLivresHoje)
            setAgendamentoMES(agendamentosMes)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div className="px-5">
            {loading ? (
                <Skeleton className="mb-3 mt-6 h-4 w-24 uppercase bg-gray-200" />
            ) : (
                <p className="text-sm lg:text-base font-semibold text-gray-400">Aqui está um resumo do que está acontecendo na sua barbearia hoje.</p>
            )}

            {loading ? (
                <>
                    <div className="grid grid-cols-2 gap-4 mt-5">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-30 w-full">
                                <Skeleton className="h-30 w-full bg-gray-200" />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-2 min-w-30 w-full mt-6">
                        <Skeleton className="h-50 w-full bg-gray-200" />
                    </div>
                </>
            ) : (
                <div>
                    <div className="grid grid-cols-2 gap-1 lg:gap-4 mt-5">
                        {/*Agendamentos Hoje */}
                        <Card>
                            <CardContent className="flex flex-row justify-between gap-1">
                                <div className="flex flex-col justify-start gap-2 w-[80%]">
                                    <p className="text-xs lg:text-base font-semibold truncate">Agendamentos hoje</p>
                                    <p className="text-base font-bold">{agendamentosHJ.length}</p>
                                    <p className="text-xs lg:text-sm font-semibold text-primary">{agendamentosPendentes.length} pendentes</p>
                                </div>
                                <div className="flex items-center w-[20%]">
                                    <div className="bg-yellow-200 p-2 rounded-lg">
                                        <CalendarIcon className="text-yellow-500 w-4 h-4 lg:w-6 lg:h-6"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/*Horários livres hoje */}
                        <Card>
                            <CardContent className="flex flex-row justify-between gap-1">
                                <div className="flex flex-col justify-start gap-2 w-[80%]">
                                    <p className="text-xs lg:text-base font-semibold truncate">Horários livres hoje</p>
                                    <p className="text-base font-bold">{horariosFuturoLivres.length}</p>
                                </div>
                                <div className="flex items-center pt-5.5 w-[20%]">
                                    <div className="bg-purple-200 p-2 rounded-lg">
                                        <ClockPlusIcon className="text-purple-500 w-4 h-4 lg:w-6 lg:h-6"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/*Receita hoje */}
                        <Card>
                            <CardContent className="flex flex-row justify-between gap-1">
                                <div className="flex flex-col justify-start gap-2 w-[80%]">
                                    <p className="text-xs lg:text-base font-semibold truncate">Receita de hoje</p>
                                    <p className='text-base font-bold'>
                                        {Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(receitaHoje)}
                                    </p>
                                </div>
                                <div className="flex items-center w-[20%]">
                                    <div className="bg-blue-200 p-2 rounded-lg">
                                        <TrendingUpIcon className="text-blue-500 w-4 h-4 lg:w-6 lg:h-6"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/*Receita Mês */}
                        <Card>
                            <CardContent className="flex flex-row justify-between gap-1">
                                <div className="flex flex-col justify-start gap-2 w-[80%]">
                                    <p className="text-xs lg:text-base font-semibold truncate">Receita do Mês</p>
                                    <p className='text-base font-bold'>
                                        {Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(receitaMes)}
                                    </p>
                                </div>
                                <div className="flex items-center w-[20%]">
                                    <div className="bg-green-200 p-2 rounded-lg">
                                        <DollarSignIcon className="text-green-500 w-4 h-4 lg:w-6 lg:h-6"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="w-full mt-4">
                        <CardContent className="flex flex-col justify-start gap-1">
                            <h2 className="text-sm lg:text-base font-semibold truncate">Serviços mais vendidos</h2>
                                    
                            <div className="flex flex-col gap-5 mt-8">
                                {top3Servicos.map((servico, index) => (
                                    <div className="flex flex-row justify-between items-center gap-2">
                                        <div className="flex flex-row gap-3 items-center">
                                            <div className="rounded-4xl bg-primary text-white py-1.5 px-3">
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-sm lg:text-base font-semibold truncate">{servico.nome}</h2>
                                                <p className="text-xs lg:text-sm text-gray-500">{servico.quantidadeAtendimentos} atendimentos</p>
                                            </div>
                                        </div>
                                        <p className='font-bold lg:text-base text-sm'>
                                            {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(servico.valorTotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
 
export default ContainerPageDashboard;

