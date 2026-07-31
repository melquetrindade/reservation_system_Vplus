"use client"

import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { PerfilUserSchema } from "@/app/schema/perfil-user-schema";

interface UpdatePerfilDialogProps {
    form: UseFormReturn<PerfilUserSchema>;
    onSubmit: (data: PerfilUserSchema) => Promise<void>;
    isSubmitting: boolean
}

const UpdatePerfilDialog = ({form, onSubmit, isSubmitting}: UpdatePerfilDialogProps) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Atualize seus dados</DialogTitle>
                    <DialogDescription>
                    Mantenha seus dados sempre atualizados!
                    </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    
                    <Field>
                        <FieldLabel htmlFor="nome">Nome</FieldLabel>
                        <FieldContent>
                            <Input
                                id="nome"
                                placeholder="Digite seu nome..."
                                {...form.register("nome")}
                            />

                            <FieldError>{form.formState.errors.nome?.message}</FieldError>
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                        <FieldContent>
                            <Input
                                id="telefone"
                                placeholder="(84) 99999-9999"
                                {...form.register("telefone")}
                            />

                            <FieldError>{form.formState.errors.telefone?.message}</FieldError>
                        </FieldContent>
                    </Field>

                </FieldGroup>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                        "Atualizar"
                    )}
                </Button>
            </form>
        </>
    );
}
 
export default UpdatePerfilDialog;