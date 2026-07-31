"use client"

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UseFormReturn } from "react-hook-form";
import { AdminSchema } from "@/app/schema/admin-schema";
import { Loader2Icon } from "lucide-react";

interface FormDialogAdminProps {
    form: UseFormReturn<AdminSchema>;
    onSubmit: (data: AdminSchema) => Promise<void>;
    submitLabel?: string;
    isLoadingCadastraAdmin: boolean
}

const FormDialogAdmin = ({ form, onSubmit, submitLabel = "Cadastrar", isLoadingCadastraAdmin }: FormDialogAdminProps) => {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
                
                <Field>
                    <FieldLabel htmlFor="nome">Nome</FieldLabel>
                    <FieldContent>
                        <Input
                        id="nome"
                        placeholder="Digite o nome"
                        {...form.register("nome")}
                        />

                        <FieldError>{form.formState.errors.nome?.message}</FieldError>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <FieldContent>
                        <Input
                        id="email"
                        placeholder="salaodebeleza@gmail.com"
                        {...form.register("email")}
                        />

                        <FieldError>
                        {form.formState.errors.email?.message}
                        </FieldError>
                    </FieldContent>
                </Field>

            </FieldGroup>
            <Button type="submit" className="w-full">
                {isLoadingCadastraAdmin ? <Loader2Icon className="size-4 animate-spin" /> : `${submitLabel}`}
            </Button>
        </form>
    );
}
 
export default FormDialogAdmin;