"use client"

import { getAdmin } from "@/app/_actions/get-admin";
import { Administrador } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSchema, adminSchema } from "@/app/schema/admin-schema";
import { toast } from "sonner";
import { createAdmin } from "@/app/_actions/create-admin";
import AdminItem from "./admin-item";
import FormDialogAdmin from "./form-dialog-admin";
import { Skeleton } from "../ui/skeleton";

const ListAdmin = () => {
    const [administrators, setAdministrators] = useState<Administrador[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isLoadingCadastraAdmin, setIsLoadingCadastraAdmin] = useState(false)

    const form = useForm<AdminSchema>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
          nome: "",
          email: ""
        },
    });

    const onSubmit = async (data: AdminSchema) => {
        try {
            setIsLoadingCadastraAdmin(true)
            const formData = new FormData();
        
            formData.append("nome", data.nome);
            formData.append("email", data.email);
        
            const newAdmin = await createAdmin(formData);
            setAdministrators((old) => [...old, newAdmin as unknown as Administrador]);
        
            form.reset();
            setOpenDialog(false);
        
            toast.success("Administrador cadastrado com sucesso!", {
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
                toast.error("Erro ao cadastrar administrador.");
          }
        } finally {
            setIsLoadingCadastraAdmin(false)
        }
    };

    const fetchData = async () => {
        setLoading(true)
        try {
            const [listAdministrators] = await Promise.all([
                getAdmin()
            ])
            setAdministrators(listAdministrators)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(!openDialog);
    };

    return (
        <div className="p-5">
            <div className="flex items-center justify-end mb-7">
                <Button onClick={handleOpenDialog} variant={null} className="bg-green-200 text-green-500">
                    <CirclePlusIcon />
                    Cadastrar Administradores
                </Button>
                </div>
            {loading ? (
                <>
                    <div className="grid grid-cols-1 px-6 gap-4 mb-10 items-center w-full">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div className="flex flex-row gap-2 w-full">
                                <div key={index} className="flex flex-col justify-start w-[75%] gap-3">
                                    <Skeleton className="ml-10 h-12.5 w-15 flex items-center justify-center rounded-sm bg-secondary" />
                                    <Skeleton className="h-4 w-40 bg-secondary" />
                                    <Skeleton className="h-4 w-40 bg-secondary" />
                                </div>

                                <div className="py-3 px-1 flex flex-row items-end gap-3">
                                    <Skeleton className="h-25 w-15 bg-secondary" />
                                    <Skeleton className="h-25 w-15 bg-secondary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : administrators.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mb-10 items-center w-full">
                    {administrators.map((admin) => (
                        <AdminItem
                            key={admin.id}
                            admin={admin}
                            setAdministrators={setAdministrators}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-xs lg:text-base font-semibold uppercase text-gray-400">Não existem administradores cadastrados</p>
            )}

            <Dialog
                open={openDialog}
                onOpenChange={(open) => {
                    setOpenDialog(open);
        
                    if (!open) {
                        form.reset();
                    }
                }}
                >
                <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <DialogHeader>
                    <DialogTitle>Preencha as informações</DialogTitle>
                    </DialogHeader>
                    
                    <FormDialogAdmin
                        form={form}
                        onSubmit={onSubmit}
                        submitLabel="Cadastrar"
                        isLoadingCadastraAdmin={isLoadingCadastraAdmin}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
 
export default ListAdmin;

/*
<h1 className="text-xs font-bold uppercase text-gray-400">Não existem administradores cadastrados</h1>
*/