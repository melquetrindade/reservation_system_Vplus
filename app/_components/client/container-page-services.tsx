"use client"

import { Profissional, Servico } from "@prisma/client";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { getProfessional } from "@/app/_actions/get-professionals";
import { toast } from "sonner";
import { SmartphoneIcon } from "lucide-react";
import { Button } from "../ui/button";
import { getServicesClient } from "@/app/_actions/get-service";
import ServiceItem from "./service-item";
import { Skeleton } from "../ui/skeleton";

interface ContainerPageServicesProps {
    id: string
}

const ContainerPageServices = ({id}: ContainerPageServicesProps) => {
    const [services, setServices] = useState<Servico[]>([])
    const [professional, setProfessional] = useState<Profissional>()
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [listServices, resp] = await Promise.all([
                getServicesClient(id),
                getProfessional(id)
            ])
            setServices(listServices as unknown as Servico[])
            setProfessional(resp!)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCopyPhoneClick = () => {
        navigator.clipboard.writeText(professional?.telefone!)
        toast.success("Telefone copiado com sucesso!", {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        },)
    }

    return (
        <div className="p-5">
            
            {/*Card Informaçõs do profissional */}
            <div className="flex flex-col gap-3 w-full mb-3 pb-3 border-b border-gray-300">
                {loading ? (
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-15 w-15 rounded-full bg-gray-200" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-40 bg-gray-200" />
                            <Skeleton className="h-4 w-28 bg-gray-200" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-2 items-center">
                            <Avatar size="lg">
                                <AvatarImage src={professional?.imgURL!} className="object-top"/>
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{professional?.nome}</h3>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className='flex items-center gap-2'>
                                <SmartphoneIcon/>
                                <p className='text-sm'>{professional?.telefone}</p>
                            </div>
                            <Button onClick={handleCopyPhoneClick} variant='destructive' size='sm'>Copiar</Button>
                        </div>
                    </>
                )}
                
            </div>
            
            {/*Serviços */}
            {loading ? (
                <>
                    <Skeleton className="mb-3 mt-6 h-4 w-24 uppercase bg-gray-200" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                <Skeleton className="h-27.5 w-27.5 rounded-lg bg-gray-200" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-40 bg-gray-200" />
                                    <Skeleton className="h-4 w-20 bg-gray-200" />
                                    <div className="flex justify-between items-center pt-4">
                                        <Skeleton className="h-5 w-24 bg-gray-200" />
                                        <Skeleton className="h-9 w-20 rounded-md bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : services.length > 0 ? (
                <>
                    <h2 className="mb-3 mt-6 text-xs font-bold uppercase">
                        Serviços
                    </h2>
                    <div className="space-y-3">
                        {services.map((service) => (
                            <ServiceItem 
                                key={service.id} 
                                service={service} 
                                professionalName={professional?.nome!}
                                professionalId={professional?.id!}    
                            />
                        ))}
                    </div>
                </>
            ) : (
                <h2>Não existe serviços</h2>
            )}

        </div>
    );
}
 
export default ContainerPageServices;