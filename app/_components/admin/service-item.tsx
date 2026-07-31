"use client";

import { ShieldCheckIcon, ShieldMinusIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Servico } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { serviceSchema, ServiceSchema } from "@/app/schema/service-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateService } from "@/app/_actions/update-service";
import { deleteService } from "@/app/_actions/delete-service";
import { desactivedService } from "@/app/_actions/desactive-service";
import ActionsServices from "./actions-services";
import FormDialogService from "./form-dialog-service";

interface ServiceItemProps {
  service: Servico;
  setServices: Dispatch<SetStateAction<Servico[]>>;
}

const ServiceItem = ({ service, setServices }: ServiceItemProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDesactiveDialog, setOpenDesactiveDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoadingUpdateServi, setIsLoadingUpdateServi] = useState(false)
  const [isLoadingDeleteServi, setIsLoadingDeleteServi] = useState(false)
  const [isLoadingDesactiveServi, setIsLoadingDesactiveServi] = useState(false)

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nome: service.nome,
      preco: service.preco.toString(),
      descricao: service.descricao ?? "",
      tempo: service.tempo ?? "",
    },
  });

  const onSubmit = async (data: ServiceSchema) => {
    try {
      setIsLoadingUpdateServi(true)
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("preco", data.preco ?? 0);
      formData.append("descricao", data.descricao ?? "");
      formData.append("tempo", data.tempo ?? "");
      formData.append("imagem", data.imagem);

      const upService = await updateService(
        formData,
        service.id,
        service.imgURLPublicId,
        service.profissionalId,
      );
      setServices((old) =>
        old.map((s) => (s.id === service.id ? upService as unknown as Servico : s)),
      );

      // Reseta o form com os dados atualizados
      form.reset({
        nome: upService.nome,
        preco: upService.preco.toString(),
        descricao: upService.descricao ?? "",
        tempo: upService.tempo ?? "",
      });
      setPreview(null);
      setOpenDialog(false);

      toast.success("Serviço atualizado com sucesso!", {
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
        toast.error("Erro ao atualizar serviço.");
      }
    } finally {
      setIsLoadingUpdateServi(false)
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoadingDeleteServi(true)
      await deleteService(
        service.id,
        service.imgURLPublicId,
        service.profissionalId,
      );
      setServices((old) => old.filter((s) => s.id !== service.id));
      setOpenDeleteDialog(false);

      toast.success("Serviço excluído com sucesso!", {
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
        toast.error("Erro ao excluir serviço.");
      }
    } finally {
      setIsLoadingDeleteServi(false)
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleDesactivated = async () => {
    try {
      setIsLoadingDesactiveServi(true)
      const action = !service.ativo;

      await desactivedService(service.id, action, service.profissionalId);
      setServices((old) =>
        old.map((s) => (s.id === service.id ? { ...s, ativo: action } : s)),
      );
      setOpenDesactiveDialog(false);

      toast.success(
        `Serviço ${action ? "ativado" : "desativado"} com sucesso!`,
        {
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        });
      } else {
        toast.error(
          `Erro ao ${!service.ativo ? "ativar" : "desativar"} serviço.`,
        );
      }
    } finally {
      setIsLoadingDesactiveServi(false)
    }
  };

  return (
    <Card className="min-w-41.75 rounded-2xl bg-secondary">
      <CardContent>
        {/*Imagem */}
        <div className="relative h-44.75 w-full lg:h-55">
          {service.imgURL ? (
            <Image
              alt="Imagem do Servico"
              src={service.imgURL}
              fill
              priority
              className="object-cover rounded-2xl object-top"
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}
          {service.ativo ? (
            <Badge className=" space-x-1 absolute rounded-md left-2 top-2 bg-green-500">
              <ShieldCheckIcon size={12} />
              <p className="text-xs font-semibold">Ativo</p>
            </Badge>
          ) : (
            <Badge className=" space-x-1 absolute rounded-md left-2 top-2 bg-gray-400">
              <ShieldMinusIcon size={12} />
              <p className="text-xs font-semibold">Desativado</p>
            </Badge>
          )}
        </div>

        {/*Texto */}
        <div className="py-3 px-1 flex justify-center">
          <h3 className="truncate font-semibold">{service.nome}</h3>
        </div>

        <ActionsServices
          handleOpenDialog={handleOpenDialog}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleDelete={handleDelete}
          openDesactiveDialog={openDesactiveDialog}
          setOpenDesactiveDialog={setOpenDesactiveDialog}
          isAtivacted={service.ativo}
          handleDesactivated={handleDesactivated}
          isLoadingDeleteServi={isLoadingDeleteServi}
          isLoadingDesactiveServi={isLoadingDesactiveServi}
        />
      </CardContent>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);

          if (open) {
            // Reseta o form com os dados atualizados do serviço
            form.reset({
              nome: service.nome,
              preco: service.preco.toString(),
              descricao: service.descricao ?? "",
              tempo: service.tempo ?? "",
            });
          } else {
            form.reset();
            setPreview(null);
          }
        }}
      >
        <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle>Edite as informações</DialogTitle>
          </DialogHeader>

          <FormDialogService
            form={form}
            onSubmit={onSubmit}
            preview={preview}
            setPreview={setPreview}
            submitLabel="Atualizar"
            isLoadingCadastraServi={isLoadingUpdateServi}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServiceItem;
