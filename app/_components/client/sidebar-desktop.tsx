"use client";

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
import Image from "next/image";

const SidebarDesktop = () => {
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
    <aside className="hidden lg:flex lg:flex-col lg:h-screen lg:w-72 lg:fixed lg:left-0 lg:top-0 lg:border-r lg:border-gray-300 lg:bg-background">
      
      {/* Logo */}
      <div className="py-2 w-full flex justify-center">
        <div className="relative h-19 w-18">
          <Image
              alt="Logo Salão de beleza"
              src="/logo_dark_1.png"
              fill
              priority
          />
        </div>
      </div>

      {/* Perfil */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-300">
        {data?.user ? (
          <>
            {data?.user?.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>{data?.user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
            )}

            <div className="min-w-0">
              <p className="font-bold truncate">{client?.name ?? data.user.name}</p>
              <p className="text-xs truncate">{data.user.email}</p>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-row justify-between items-center">
            <h2 className="font-bold text-sm">Olá, faça seu login</h2>
            <Dialog>
              <DialogTrigger>
                <Button size="sm">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] text-center">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="flex-1 flex-col px-3 py-4 space-y-1">
        <div className="flex flex-col gap-2">
          <Button className="gap-2 justify-start" variant="ghost">
            <HomeIcon size={18} />
            <Link href="/">Inicio</Link>
          </Button>

          <Button className="gap-2 justify-start" variant="ghost">
            <CalendarIcon />
            <Link href={`/agendamentos`}>Agendamentos</Link>
          </Button>

          {data?.user && (
            <Button
              className="w-full gap-3 justify-start"
              variant="ghost"
              onClick={() => setDialogIsOpenPerfil(true)}
            >
              <FileUserIcon size={18} />
              Atualizar perfil
            </Button>
          )}
        </div>
      </div>

      {/* Sair */}
      {data?.user && (
        <div className="px-3 py-4 border-t border-gray-300">
          <Button
            className="w-full gap-3 justify-start py-5"
            variant="default"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}

      {/* Dialog de perfil */}
      <Dialog open={dialogIsOpenPerfil} onOpenChange={(open) => setDialogIsOpenPerfil(open)}>
        <DialogContent className='w-[90%]'>
          <UpdatePerfilDialog form={form} onSubmit={onSubmit} isSubmitting={isSubmitting}/>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default SidebarDesktop;