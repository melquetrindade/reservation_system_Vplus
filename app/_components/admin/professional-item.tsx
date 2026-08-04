import { Profissional } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { ShieldCheckIcon, ShieldMinusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
  professionalSchema,
  ProfessionalSchema,
} from "@/app/schema/professional-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormDialog from "./form-dialog-professional";
import { updateProfessional } from "@/app/_actions/update-professional";
import { deleteProfessional } from "@/app/_actions/delete-professional";
import { Badge } from "../ui/badge";
import { desactivedProfessional } from "@/app/_actions/desactive-professional";
import ActionsProfessionals from "./actions-professionals";

interface ProfessioanlItemProps {
  professional: Profissional;
  setProfessionals: Dispatch<SetStateAction<Profissional[]>>;
}

const ProfessionalItem = ({
  professional,
  setProfessionals,
}: ProfessioanlItemProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDesactiveDialog, setOpenDesactiveDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoadingUpdateProfi, setIsLoadingUpdateProfi] = useState(false)
  const [isLoadingDeleteProfi, setIsLoadingDeleteProfi] = useState(false)
  const [isLoadingDesactiveProfi, setIsLoadingDesactiveProfi] = useState(false)

  const form = useForm<ProfessionalSchema>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: professional.nome,
      telefone: professional.telefone ?? "",
    },
  });

  const onSubmit = async (data: ProfessionalSchema) => {
    try {
      setIsLoadingUpdateProfi(true)
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("telefone", data.telefone ?? "");
      formData.append("imagem", data.imagem);

      const upProfessional = await updateProfessional(
        formData,
        professional.id,
        professional.imgURLPublicId,
      );
      setProfessionals((old) =>
        old.map((p) => (p.id === professional.id ? upProfessional : p)),
      );

      // Reseta o form com os dados atualizados
      form.reset({
        nome: upProfessional.nome,
        telefone: upProfessional.telefone ?? ""
      });
      setPreview(null);
      setOpenDialog(false);

      toast.success("Profissional atualizado com sucesso!", {
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
        toast.error("Erro ao atualizar profissional.");
      }
    } finally {
      setIsLoadingUpdateProfi(false)
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoadingDeleteProfi(true)
      await deleteProfessional(professional.id, professional.imgURLPublicId);
      setProfessionals((old) => old.filter((p) => p.id !== professional.id));
      setOpenDeleteDialog(false);
      toast.success("Profissional excluído com sucesso!", {
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
        toast.error("Erro ao excluir profissional.");
      }
    } finally {
      setIsLoadingDeleteProfi(false)
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleDesactivated = async () => {
    try {
      setIsLoadingDesactiveProfi(true)
      const action = !professional.ativo;

      await desactivedProfessional(professional.id, action);
      setProfessionals((old) =>
        old.map((p) =>
          p.id === professional.id ? { ...p, ativo: action } : p,
        ),
      );
      setOpenDesactiveDialog(false);

      toast.success(
        `Profissional ${action ? "ativado" : "desativado"} com sucesso!`,
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
          `Erro ao ${!professional.ativo ? "ativar" : "desativar"} profissional.`,
        );
      }
    } finally {
      setIsLoadingDesactiveProfi(false)
    }
  };

  return (
    <Card className="min-w-41.75 max-w-60 rounded-2xl bg-secondary ring-0 pt-0">
      <CardContent className="w-full px-1 pt-1">
        {/*Imagem */}
        <div className="relative h-44.75 w-full lg:h-55">
          {professional.imgURL ? (
            <Image
              alt="Imagem do Profissional"
              src={professional.imgURL}
              fill
              priority
              className="object-cover rounded-2xl object-top"
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}
          {professional.ativo ? (
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
          <h3 className="truncate font-semibold text-sm">{professional.nome}</h3>
        </div>

        <ActionsProfessionals
          handleOpenDialog={handleOpenDialog}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleDelete={handleDelete}
          openDesactiveDialog={openDesactiveDialog}
          setOpenDesactiveDialog={setOpenDesactiveDialog}
          isAtivacted={professional.ativo}
          handleDesactivated={handleDesactivated}
          professionalId={professional.id}
          isLoadingDeleteProfi={isLoadingDeleteProfi}
          isLoadingDesactiveProfi={isLoadingDesactiveProfi}
        />
      </CardContent>

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
            <DialogTitle>Edite as informações</DialogTitle>
          </DialogHeader>

          <FormDialog
            form={form}
            onSubmit={onSubmit}
            preview={preview}
            setPreview={setPreview}
            submitLabel="Atualizar"
            isLoadingCadastraProfi={isLoadingUpdateProfi}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfessionalItem;
