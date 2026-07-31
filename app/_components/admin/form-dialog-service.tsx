"use client"

import { Controller } from "react-hook-form";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceSchema } from "@/app/schema/service-schema";
import { Loader2Icon } from "lucide-react";

interface FormDialogServiceProps {
    form: UseFormReturn<ServiceSchema>;
    onSubmit: (data: ServiceSchema) => Promise<void>;
    preview: string | null;
    setPreview: Dispatch<SetStateAction<string | null>>;
    submitLabel?: string;
    isLoadingCadastraServi: boolean
}

const FormDialogService = ({ form, onSubmit, preview, setPreview, submitLabel = "Cadastrar", isLoadingCadastraServi }: FormDialogServiceProps) => {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="nome">Nome</FieldLabel>
                    <FieldContent>
                        <Input
                        id="nome"
                        placeholder="Digite o nome do serviço"
                        {...form.register("nome")}
                        />

                        <FieldError>{form.formState.errors.nome?.message}</FieldError>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel htmlFor="preco">Preço</FieldLabel>
                    <FieldContent>
                        <Input
                        id="preco"
                        placeholder="R$ 30,00"
                        {...form.register("preco")}
                        />

                        <FieldError>
                        {form.formState.errors.preco?.message}
                        </FieldError>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                    <FieldContent>
                        <Input
                        id="descricao"
                        placeholder="Corte clássico feminino com acabamento perfeito"
                        {...form.register("descricao")}
                        />

                        <FieldError>
                        {form.formState.errors.descricao?.message}
                        </FieldError>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel htmlFor="tempo">Tempo do Serviço</FieldLabel>
                    <FieldContent>
                        <Input
                        id="tempo"
                        placeholder="30:00"
                        {...form.register("tempo")}
                        />

                        <FieldError>
                        {form.formState.errors.tempo?.message}
                        </FieldError>
                    </FieldContent>
                </Field>

                <Field>
                    <FieldLabel htmlFor="imagem">Imagem do serviço</FieldLabel>
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
                {isLoadingCadastraServi ?
                    <Loader2Icon className="size-4 animate-spin" />
                : `${submitLabel}`}
            </Button>
        </form>
    );
}
 
export default FormDialogService;