"use client"

import { format } from "date-fns";
import { Card, CardContent } from "../ui/card";
import { ptBR } from "date-fns/locale";
import { Servico } from "@prisma/client";

interface SummaryReservaProps {
    service: Servico,
    selectedDate: Date | null,
    professionalName: string
}

const SummaryReserva = ({service, selectedDate, professionalName}: SummaryReservaProps) => {
    return (
        <Card>
            <CardContent className='p-3 space-y-3'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold'>{service.nome}</h2>
                    <p className='text-sm font-bold'>
                        {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(Number(service.preco))}
                    </p>
                </div>

                <div className='flex items-center justify-between'>
                    <h2 className='text-sm text-gray-400'>Data</h2>
                    <p className='text-sm'>
                        {format(selectedDate!, "d 'de' MMMM", {
                            locale: ptBR,
                        })}
                    </p>
                </div>

                <div className='flex items-center justify-between'>
                    <h2 className='text-sm text-gray-400'>Horário</h2>
                    <p className='text-sm'>
                        {format(selectedDate!, "HH:mm", {
                            locale: ptBR,
                        })}
                    </p>
                </div>

                <div className='flex items-center justify-between'>
                    <h2 className='text-sm text-gray-400'>Profissional</h2>
                    <p className='text-sm'>
                        {professionalName}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default SummaryReserva;