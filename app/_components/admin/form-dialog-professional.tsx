"use client"

import { Controller } from "react-hook-form";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Image from "next/image";
import { ProfessionalSchema } from "@/app/schema/professional-schema";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

interface FormDialogProps {
    form: UseFormReturn<ProfessionalSchema>;
    onSubmit: (data: ProfessionalSchema) => Promise<void>;
    preview: string | null;
    setPreview: Dispatch<SetStateAction<string | null>>;
    submitLabel?: string;
    isLoadingCadastraProfi: boolean
}

const FormDialog = ({ form, onSubmit, preview, setPreview, submitLabel = "Cadastrar", isLoadingCadastraProfi }: FormDialogProps) => {
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
                <FieldLabel htmlFor="telefone">Telefone</FieldLabel>

                <FieldContent>
                    <Input
                    id="telefone"
                    placeholder="(84) 99999-9999"
                    {...form.register("telefone")}
                    />

                    <FieldError>
                    {form.formState.errors.telefone?.message}
                    </FieldError>
                </FieldContent>
                </Field>

                <Field>
                <FieldLabel htmlFor="imagem">Foto do Profissional</FieldLabel>

                <FieldContent>
                    <Controller
                    control={form.control}
                    name="imagem"
                    render={({ field }) => (
                        <Input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        className="file:mr-3 text-[0.8125rem]"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            // Atualiza o React Hook Form
                            field.onChange(file);

                            // Atualiza o preview
                            if (preview) {
                            URL.revokeObjectURL(preview);
                            }

                            setPreview(URL.createObjectURL(file));
                        }}
                        />
                    )}
                    />

                    <FieldError>
                    {form.formState.errors.imagem?.message}
                    </FieldError>
                </FieldContent>
                </Field>
            </FieldGroup>

            {preview && (
                <div className="flex justify-center">
                <div className="relative min-w-35 h-45">
                    <Image
                    src={preview}
                    alt="Pré-visualização"
                    fill
                    priority
                    className="rounded-md object-cover object-top"
                    />
                </div>
                </div>
            )}

            <Button type="submit" className="w-full">
                {isLoadingCadastraProfi ? 
                    <Loader2Icon className="size-4 animate-spin" /> 
                : `${submitLabel}`}
            </Button>
        </form>
    );
}
 
export default FormDialog;