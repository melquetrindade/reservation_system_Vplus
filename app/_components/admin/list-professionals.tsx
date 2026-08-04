"use client";

import { getProfessionals } from "@/app/_actions/get-professionals";
import { Profissional } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserRoundPlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfessional } from "@/app/_actions/create-professional";
import ProfessionalItem from "./professional-item";
import { toast } from "sonner";
import {
  professionalSchema,
  ProfessionalSchema,
} from "@/app/schema/professional-schema";
import FormDialog from "./form-dialog-professional";
import { Skeleton } from "../ui/skeleton";

const ListProfessionals = () => {
  const [professionals, setProfessionals] = useState<Profissional[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [isLoadingCadastraProfi, setIsLoadingCadastraProfi] = useState(false)

  const form = useForm<ProfessionalSchema>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: "",
      telefone: "",
    },
  });

  const onSubmit = async (data: ProfessionalSchema) => {
    try {
      setIsLoadingCadastraProfi(true)
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("telefone", data.telefone ?? "");
      formData.append("imagem", data.imagem);

      const newProfessional = await createProfessional(formData);
      setProfessionals((old) => [...old, newProfessional]);

      form.reset();
      setPreview(null);
      setOpenDialog(false);

      toast.success("Profissional cadastrado com sucesso!", {
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
        toast.error("Erro ao cadastrar profissional.");
      }
    } finally {
      setIsLoadingCadastraProfi(false)
    }
  };

  const fetchData = async () => {
    try {
        setLoading(true)
        const [listProfessionals] = await Promise.all([
            getProfessionals()
        ])
        setProfessionals(listProfessionals)
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
          <UserRoundPlusIcon className="text-green-500"/>
            Cadastrar profissional
        </Button>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-10">
              {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 min-w-30">
                      <Skeleton className="h-44.75 w-41.75 rounded-2xl bg-secondary" />
                      <Skeleton className="h-4 w-40 bg-secondary" />
                      <div className="flex justify-center gap-3">
                        <Skeleton className="h-4 w-11 bg-secondary" />
                        <Skeleton className="h-4 w-11 bg-secondary" />
                        <Skeleton className="h-4 w-11 bg-secondary" />
                      </div>
                      <Skeleton className="h-4 w-40 bg-secondary" />
                  </div>
              ))}
          </div>
        </>
      ) : professionals.length == 0 ? (
        <p className="text-xs lg:text-base font-semibold uppercase text-gray-400">Não existem profissionais cadastrados</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-10 lg:grid-cols-4 lg:gap-6">
          {professionals.map((professional) => (
            <ProfessionalItem
              key={professional.id}
              professional={professional}
              setProfessionals={setProfessionals}
            />
          ))}
        </div>
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

          <FormDialog
            form={form}
            onSubmit={onSubmit}
            preview={preview}
            setPreview={setPreview}
            submitLabel="Cadastrar"
            isLoadingCadastraProfi={isLoadingCadastraProfi}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListProfessionals;

/*

*/