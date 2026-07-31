"use client"

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldContent, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { DisponibilidadeForm } from "@/app/schema/disponibilidade-schema";
import { Loader2Icon } from "lucide-react";

interface FormDialogAgendaProps {
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    openDialog: boolean
    form: UseFormReturn<DisponibilidadeForm>
    onSubmit: (values: DisponibilidadeForm) => Promise<void>
    isLoadingCadastraDispo: boolean
}

const FormDialogAgenda = ({
    setOpenDialog,
    openDialog,
    form,
    onSubmit,
    isLoadingCadastraDispo
}: FormDialogAgendaProps) => {
    return (
        <div className="flex justify-center lg:w-full lg:h-full lg:items-center">
            <Button onClick={() => setOpenDialog(true)}>
                Cadastrar Horários
            </Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <DialogHeader>
                    <DialogTitle>Preencha as informações</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Horário Inicial</FieldLabel>

                            <FieldContent>
                                <Input
                                type="time"
                                {...form.register("horaInicio")}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Horário Final</FieldLabel>

                            <FieldContent>
                                <Input
                                type="time"
                                {...form.register("horaFim")}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Intervalo (minutos)</FieldLabel>

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

                        <Field>
                            <FieldLabel>Início do Intervalo (opcional)</FieldLabel>
                            <FieldContent>
                                <Input
                                type="time"
                                {...form.register("horaInicioIntervalo")}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Fim do Intervalo (opcional)</FieldLabel>
                            <FieldContent>
                                <Input
                                type="time"
                                {...form.register("horaFimIntervalo")}
                                />
                            </FieldContent>
                        </Field>
                    </FieldGroup>

                    <Button type="submit" className="w-full">
                        {isLoadingCadastraDispo ? 
                            <Loader2Icon className="size-4 animate-spin"/>
                        : "Gerar Horários"}
                    </Button>
                </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
 
export default FormDialogAgenda;