"use client"

import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { PhoneClientSchema } from "@/app/schema/phone-client-schema";

interface PhoneDialogProps {
    form: UseFormReturn<PhoneClientSchema>;
    onSubmit: (data: PhoneClientSchema) => Promise<void>;
}

const PhoneDialog = ({form, onSubmit}: PhoneDialogProps) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Informe seu telefone</DialogTitle>
                <DialogDescription>
                    Antes de reservar um serviço, cadastre seu telefone para contato!
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    
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

                <Button type="submit" className="w-full">
                    Cadastrar telefone
                </Button>
            </form>
        </>
        
    );
}
 
export default PhoneDialog;