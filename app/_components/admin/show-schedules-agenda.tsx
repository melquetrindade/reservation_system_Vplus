"use client"

import { ClockIcon, Loader2Icon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Prisma } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { blockTime, unlockTime } from "@/app/_actions/handle-time";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Field, FieldContent, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddHorarioForm, addHorarioSchema } from "@/app/schema/add-horario-schema";
import { addDisponibilidade } from "@/app/_actions/addDisponibilidade";
import { getDisponibilidade } from "@/app/_actions/getDisponibilidade";

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
      };
    };
  };
}>;

interface ShowSchedulesAgendaProps {
    selectedDay: Date | undefined
    setDisponibilidade: Dispatch<SetStateAction<DisponibilidadeComAgendamentos[]>>
    disponibilidade: DisponibilidadeComAgendamentos[]
    professionalId: string
}

const ShowSchedulesAgenda = ({selectedDay, disponibilidade, setDisponibilidade, professionalId}: ShowSchedulesAgendaProps) => {
    const [selectedSlot, setSelectedSlot] = useState<DisponibilidadeComAgendamentos | null>(null);
    const [isLoadingBlockTime, setIsLoadingBlockTime] = useState(false)
    const [isLoadingUnlockTime, setIsLoadingUnlockTime] = useState(false)
    const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false)
    const [isAddingSchedules, setIsAddingSchedules] = useState(false)

    const form = useForm<AddHorarioForm>({
        resolver: zodResolver(addHorarioSchema),
        defaultValues: {
          horaInicio: "",
          intervalo: 30,
        },
    });

    const handleAddSchedules = async (values: AddHorarioForm) => {
        if (!selectedDay) return;

        try {
            console.log('entrou para cadastrar novo horário')
            setIsAddingSchedules(true)
            await addDisponibilidade({
                professionalId,
                selectedDay,
                horaInicio: values.horaInicio,
                intervalo: values.intervalo,
            });

            // Atualiza a lista local após adicionar
            const data = await getDisponibilidade({
                selectedDay,
                professionalId,
            });
            setDisponibilidade(data);

            form.reset();
            setAddScheduleDialogOpen(false);
            toast.success("Novos horários adicionados com sucesso!", {
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
                toast.error("Erro ao adicionar horários.");
            }
        } finally {
            setIsAddingSchedules(false)
        }
    };

    const titleDialog = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return 'Informação do Cliente'
        } else if (slot.status === "BLOQUEADO"){
            return 'Desbloquear horário'
        } return 'Bloquear horário'
    }

    const descriptionDialog = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return <div className="p-4 flex flex-col items-start">
                <p><span className="font-semibold">Nome: </span>{slot.agendamentos[0]?.usuario?.name}</p>
                <p><span className="font-semibold">Telefone: </span>{slot.agendamentos[0]?.usuario?.telefone}</p>
                <p><span className="font-semibold">E-mail: </span>{slot.agendamentos[0]?.usuario?.email}</p>
            </div>
        }
        else if(slot.status === "LIVRE"){
            return <p>Ao bloquear, seus clientes não poderão reservar este horário. Você pode desbloquear a qualquer momento!</p>
        }
        return <p>Ao desbloquear, seus clientes poderão reservar este horário. Você pode bloquear a qualquer momento!</p>
    }

    const labelButton = (slot: DisponibilidadeComAgendamentos) => {
        if(slot.status === "RESERVADO"){
            return 'Copiar telefone'
        } else if (slot.status === "BLOQUEADO"){
            return 'Desbloquear'
        } return 'Bloquear'
    }

    const handleBlock = async (slot: DisponibilidadeComAgendamentos) => {
        try{
            setIsLoadingBlockTime(true)
            const upTime = await blockTime(slot.id, slot.profissionalId)
            setDisponibilidade((old) =>
                old.map((d) => (d.id === slot.id ? { ...d, status: upTime.status as any } : d)),
            );

            setSelectedSlot(null);
            toast.success("Horário bloqueado com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error){
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao bloquear horário.");
            }
        } finally {
            setIsLoadingBlockTime(false)
        }
    }

    const handleUnlock = async (slot: DisponibilidadeComAgendamentos) => {
        try{
            setIsLoadingUnlockTime(true)
            const upTime = await unlockTime(slot.id, slot.profissionalId)
            setDisponibilidade((old) =>
                old.map((d) => (d.id === slot.id ? { ...d, status: upTime.status as any } : d)),
            );

            setSelectedSlot(null);
            toast.success("Horário desbloqueado com sucesso!", {
                style: {
                    background: "#22c55e",
                    color: "#fff",
                },
            });
        } catch (error){
            if (error instanceof Error) {
                toast.error(error.message, {
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Erro ao desbloquear horário.");
            }
        } finally {
            setIsLoadingUnlockTime(false)
        }
    }

    const copyPhone = (phone: string) => {
        navigator.clipboard.writeText(phone)
        toast.success("Telefone copiado com sucesso!", {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        },)
    }

    return (
        <div className="px-5 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold mb-3">
                Horários disponíveis em {format(selectedDay!, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <Card className="ring-0 border-secondary">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        {disponibilidade.map((slot) => (
                            <Dialog 
                                key={slot.id} 
                                open={selectedSlot?.id === slot.id} 
                                onOpenChange={(open) => {
                                    if (!open) setSelectedSlot(null);
                                    }}
                                >
                                <DialogTrigger onClick={() => setSelectedSlot(slot)}>
                                    <div
                                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${slot.status === "LIVRE" ? 'bg-green-100' : slot.status === "RESERVADO" ? 'bg-yellow-100' : 'bg-gray-100'}`}
                                    >
                                        <ClockIcon size={14} className={`${slot.status === "LIVRE" ? 'text-green-600' : slot.status === "RESERVADO" ? 'text-yellow-600' : 'text-gray-600'}`} />
                                        <span className={`${slot.status === "LIVRE" ? 'text-green-600' : slot.status === "RESERVADO" ? 'text-yellow-600' : 'text-gray-600'}`}>
                                            {format(slot.horaInicio, "HH:mm")} - {format(slot.horaFim, "HH:mm")}
                                        </span>
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="w-[90%] text-center">
                                    <DialogHeader>
                                        <DialogTitle>{titleDialog(slot)}</DialogTitle>
                                        
                                        <DialogDescription>
                                            {descriptionDialog(slot)}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Button className="gap-2 font-bold" onClick={slot.status === "RESERVADO" ? () => copyPhone(slot.agendamentos[0]?.usuario?.telefone!) : slot.status === "BLOQUEADO" ? () => handleUnlock(slot) : () => handleBlock(slot)}>
                                        {isLoadingBlockTime || isLoadingUnlockTime ?
                                            <Loader2Icon className="size-4 animate-spin"/>
                                        : labelButton(slot)}
                                    </Button>
                                </DialogContent>
                            </Dialog>
                            
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={addScheduleDialogOpen} onOpenChange={setAddScheduleDialogOpen}>
                <DialogTrigger>
                    <Button className="mb-5 mt-5">
                        Cadastrar novo horário
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <DialogHeader>
                        <DialogTitle>Adicionar novos horários</DialogTitle>
                        <DialogDescription>
                            Os novos horários não podem conflitar com horários já existentes (LIVRE, BLOQUEADO ou RESERVADO).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(handleAddSchedules)} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Horário</FieldLabel>
                                <FieldContent>
                                    <Input
                                    type="time"
                                    className="[&::-webkit-calendar-picker-indicator]:invert"
                                    {...form.register("horaInicio")}
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Duração (minutos)</FieldLabel>
                                <FieldContent>
                                <Input
                                    type="number"
                                    min={5}
                                    step={5}
                                    {...form.register("intervalo", {
                                    valueAsNumber: true,
                                    })}
                                />
                                </FieldContent>
                            </Field>
                        </FieldGroup>

                        <Button type="submit" className="w-full" disabled={isAddingSchedules}>
                            {isAddingSchedules ? 
                                <Loader2Icon className="size-4 animate-spin"/>
                            : "Adicionar Horário"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
 
export default ShowSchedulesAgenda;