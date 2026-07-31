"use client";

import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { CalendarIcon, FileUserIcon, HomeIcon, LogInIcon, LogOutIcon, Loader2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Link from "next/link";
import SignInDialog from "./sign-in-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { perfilUserSchema, PerfilUserSchema } from "@/app/schema/perfil-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePerfilUser } from "@/app/_actions/update-perfil-user";
import { getUser } from "@/app/_actions/get-user";
import { User } from "@prisma/client";
import UpdatePerfilDialog from "./update-perfil-dialog";

const SiderbarSheetClient = () => {
  const { data } = useSession();
  const handleLogoutClick = () => signOut();
  const [dialogIsOpenPerfil, setDialogIsOpenPerfil] = useState(false)
  const [client, setClient] = useState<User | null>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PerfilUserSchema>({
    resolver: zodResolver(perfilUserSchema),
    defaultValues: {
      nome: "",
      telefone: "",
    },
  });

  const onSubmit = async (dataPerfil: PerfilUserSchema) => {
    try {
      if (!data?.user?.id) {
        toast.error("Usuário não identificado.");
        return;
      }

      setIsSubmitting(true)

      const formData = new FormData();
      formData.append("telefone", dataPerfil.telefone ?? "");
      formData.append("nome", dataPerfil.nome ?? "");
  
      const updatedUser = await updatePerfilUser(formData, data.user.id);
  
      setClient(updatedUser);
      form.reset();
      setDialogIsOpenPerfil(false)
      toast.success("Perfil atualizado com sucesso!", {
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
          toast.error("Erro ao atualizar perfil.");
        }
    } finally {
        setIsSubmitting(false)
    }
  };

  const fetchUser = async (id: string) => {
    const client = await getUser(id);
    setClient(client);
  };

  useEffect(() => {
    if(data?.user?.id) {
      fetchUser(data.user.id)
    }
  }, [data?.user?.id])

  useEffect(() => {
    if (client) {
      form.reset({
        nome: client.name ?? "",
        telefone: client.telefone ?? "",
      });
    }
  }, [client, form])

  return (
    <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between px-5 border-b border-solid gap-3 pb-4">
        {data?.user ? (
          <div className="flex items-center gap-2">
            {data?.user?.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>{data?.user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
            )}

            <div>
              <p className="font-bold">{client?.name ?? data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login</h2>
            <Dialog>
              <DialogTrigger>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] text-center">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="px-5 flex flex-col gap-2 border-b border-solid pb-5">
        <Button
          className="gap-2 justify-start"
          variant="ghost"
          render={<SheetClose />}
        >
          <HomeIcon size={18} />
          <Link href="/">Inicio</Link>
        </Button>

        <Button className="gap-2 justify-start" variant="ghost">
          <CalendarIcon />
          <Link href={`/agendamentos`}>Agendamentos</Link>
        </Button>

        {data?.user && (
          <Button className="gap-2 justify-start" variant="ghost" onClick={() => setDialogIsOpenPerfil(true)}>
            <FileUserIcon />
            Atualizar perfil
          </Button>
        )}
      </div>

      {data?.user && (
        <div className="px-5 flex flex-col border-b border-solid pb-5">
          <Button
            className="py-5 justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}

      <Dialog open={dialogIsOpenPerfil} onOpenChange={(open) => setDialogIsOpenPerfil(open)}>
        <DialogContent className='w-[90%]'>
          <UpdatePerfilDialog form={form} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
        </DialogContent>
      </Dialog>
    </SheetContent>
  );
};

export default SiderbarSheetClient;
