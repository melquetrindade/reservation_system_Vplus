"use client";

import { useEffect, useState } from "react";
import { Servico } from "@prisma/client";
import { getServicesAdmin } from "@/app/_actions/get-service";
import { Button } from "../ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, ServiceSchema } from "@/app/schema/service-schema";
import { toast } from "sonner";
import { createService } from "@/app/_actions/create-service";
import ServiceItem from "./service-item";
import FormDialogService from "./form-dialog-service";
import { getProfessional } from "@/app/_actions/get-professionals";
import { Skeleton } from "../ui/skeleton";

interface ListServicesProps {
  id: string;
}

const ListServices = ({ id }: ListServicesProps) => {
  const [services, setServices] = useState<Servico[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [nameProfessional, setNameProfessional] = useState<string | null>()
  const [loading, setLoading] = useState(false)
  const [isLoadingCadastraServi, setIsLoadingCadastraServi] = useState(false)

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nome: "",
      preco: "",
      descricao: "",
      tempo: "",
    },
  });

  const onSubmit = async (data: ServiceSchema) => {
    try {
      setIsLoadingCadastraServi(true)
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("preco", data.preco ?? 0);
      formData.append("descricao", data.descricao ?? "");
      formData.append("tempo", data.tempo ?? "");
      formData.append("imagem", data.imagem);

      const newService = await createService(formData, id);
      setServices((old) => [...old, newService as unknown as Servico]);

      form.reset();
      setPreview(null);
      setOpenDialog(false);

      toast.success("Serviço cadastrado com sucesso!", {
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
        toast.error("Erro ao cadastrar serviço.");
      }
    } finally {
      setIsLoadingCadastraServi(false)
    }
  };

  const fetchData = async () => {
    setLoading(true)
    try {
        const [listServices, professional] = await Promise.all([
            getServicesAdmin(id),
            getProfessional(id),
        ])
        setServices(listServices as unknown as Servico[]);
        setNameProfessional(professional?.nome)
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
      <div className="flex items-center justify-between mb-7">
        { loading ? (
          <Skeleton className="h-4 w-40 bg-gray-200" />
        ) : nameProfessional && (
          <div>
            <h1 className="font-semibold text-sm">Serviços de {nameProfessional}</h1>
          </div>
        )}
        
        <Button onClick={handleOpenDialog} variant={null} className="bg-green-200 text-green-500">
          <CirclePlusIcon />
          Cadastrar serviços
        </Button>
      </div>

      { loading ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-10">
              {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 min-w-30">
                      <Skeleton className="h-44.75 w-41.75 rounded-2xl bg-gray-200" />
                      <Skeleton className="h-4 w-40 bg-gray-200" />
                      <div className="flex justify-center gap-3">
                        <Skeleton className="h-4 w-11 bg-gray-200" />
                        <Skeleton className="h-4 w-11 bg-gray-200" />
                        <Skeleton className="h-4 w-11 bg-gray-200" />
                      </div>
                  </div>
              ))}
          </div>
        </>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mb-10 lg:grid-cols-4 lg:gap-6">
          {services.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              setServices={setServices}
            />
          ))}
        </div>
      ) : (
        <p>Este profissional não tem serviços cadastrados</p>
      )}

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);

          if (!open) {
            form.reset();
            setPreview(null);
          }
        }}
      >
        <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle>Preencha as informações</DialogTitle>
          </DialogHeader>
          
          <FormDialogService
            form={form}
            onSubmit={onSubmit}
            preview={preview}
            setPreview={setPreview}
            submitLabel="Cadastrar"
            isLoadingCadastraServi={isLoadingCadastraServi}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListServices;