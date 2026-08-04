"use client"

import { ptBR } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { getDisponibilidade } from "@/app/_actions/getDisponibilidade";
import { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { DisponibilidadeForm, disponibilidadeSchema } from "@/app/schema/disponibilidade-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDisponibilidade } from "@/app/_actions/createDisponibilidade";
import { toast } from "sonner";
import FormDialogAgenda from "./form-dialog-agenda";
import ShowSchedulesAgenda from "./show-schedules-agenda";
import { Loader2Icon } from "lucide-react";

type DisponibilidadeComAgendamentos = Prisma.DisponibilidadeGetPayload<{
  include: {
    agendamentos: {
      include: {
        usuario: {
          select: {
            id: true;
            name: true;
            telefone: true;
            email: true
          };
        };
        servico: true;
      };
    };
  };
}>;

interface AgendaProfessionalProps {
    id: string
}

const AgendaProfessional = ({id}: AgendaProfessionalProps) => {
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [disponibilidade, setDisponibilidade] = useState<DisponibilidadeComAgendamentos[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isLoadingCadastraDispo, setIsLoadingCadastraDispo] = useState(false)

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }

    const form = useForm<DisponibilidadeForm>({
        resolver: zodResolver(disponibilidadeSchema),
        defaultValues: {
          horaInicio: "",
          horaFim: "",
          intervalo: 30,
        },
    });

    const fetchData = async () => {
        try {
            setLoading(true)
            if (!selectedDay) {
                setDisponibilidade([]);
                return;
            }

            const [data] = await Promise.all([
                getDisponibilidade({selectedDay, professionalId: id})
            ])
            setDisponibilidade(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedDay, id]);

    const onSubmit = async (values: DisponibilidadeForm) => {
        if (!selectedDay) return;

        try {
            setIsLoadingCadastraDispo(true)
            await createDisponibilidade({
                professionalId: id,
                selectedDay,
                horaInicio: values.horaInicio,
                horaFim: values.horaFim,
                intervalo: values.intervalo,
                horaInicioIntervalo: values.horaInicioIntervalo || undefined,
                horaFimIntervalo: values.horaFimIntervalo || undefined,
            });

            // Atualiza a lista local após criar
            const data = await getDisponibilidade({
                selectedDay,
                professionalId: id,
            });
            setDisponibilidade(data);

            form.reset();
            toast.success("Horários gerados com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao gerar horários.");
            }
        } finally {
            setIsLoadingCadastraDispo(false)
        }
    };

    return (
        <div className="lg:flex lg:flex-row lg:justify-center lg:mt-10 lg:w-full">
            <div className='px-5 pb-4 pt-5 flex justify-center lg:w-[50%] lg:items-center lg:pb-0'>
                <div className="w-full max-w-87.5 lg:max-w-95 mt-4 lg:mt-0">
                    <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        locale={ptBR}
                        disabled={{before: new Date()}}
                        className='rounded-2xl w-full bg-black/50'
                        classNames={{
                            root: "w-full",
                            weekday: "flex-1 capitalize text-center font-medium text-sm py-1",
                            day: "flex-1",
                            month_caption: "flex justify-center items-center text-center capitalize font-semibold text-base py-1",
                            button_previous: "h-10 w-10",
                            button_next: "h-10 w-10",
                            week: "mt-2 flex w-full gap-1",
                            month_grid: "w-full border-collapse",
                        }}
                    />
                </div>
            </div>
            
            <div className="lg:w-[50%]">
                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <h3 className="font-semibold">Carregando horários</h3>
                        <Loader2Icon className="size-4 animate-spin"/> 
                    </div>
                ) : selectedDay && disponibilidade.length > 0 ? (
                    <ShowSchedulesAgenda 
                        selectedDay={selectedDay}
                        setDisponibilidade={setDisponibilidade}
                        disponibilidade={disponibilidade}
                        professionalId={id}
                    />
                ): selectedDay && (
                    <FormDialogAgenda 
                        onSubmit={onSubmit}
                        setOpenDialog={setOpenDialog}
                        form={form}
                        openDialog={openDialog}
                        isLoadingCadastraDispo={isLoadingCadastraDispo}
                    />
                )}
            </div>
            
        </div>
    );
}
 
export default AgendaProfessional;