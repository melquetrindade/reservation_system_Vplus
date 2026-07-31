"use client"

import { Button } from "../ui/button";
import { BanIcon, EditIcon, Loader2Icon, UserRoundX } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface ActionsServicesProps {
    handleOpenDialog: () => void;
    openDeleteDialog: boolean;
    setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>;
    openDesactiveDialog: boolean;
    setOpenDesactiveDialog: Dispatch<SetStateAction<boolean>>;
    isAtivacted: boolean;
    handleDesactivated: () => Promise<void>;
    isLoadingDeleteServi: boolean
    isLoadingDesactiveServi: boolean
}

const ActionsServices = ({
    handleOpenDialog,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDelete,
    openDesactiveDialog,
    setOpenDesactiveDialog,
    isAtivacted,
    handleDesactivated,
    isLoadingDeleteServi,
    isLoadingDesactiveServi,
}: ActionsServicesProps) => {
    return (
        <div className="w-full">
          <div className="flex flex-row justify-between gap-2 w-full mt-2 pr-1">
            <Button className="w-[32%] bg-yellow-200 text-white" variant={null} onClick={handleOpenDialog}>
              <EditIcon className="text-yellow-500"/>
            </Button>

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <AlertDialogTrigger render={<Button className="w-[31%] bg-red-200" variant={null}><UserRoundX className="text-red-500"/></Button>}>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer excluir este serviço?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    Ao excluir, você perderá o serviço e não poderá
                    recuperá-lo. Essa ação é irreversível.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white"
                    style={{ backgroundColor: "#dc2626" }}
                    onClick={handleDelete}
                  >
                    {isLoadingDeleteServi ? 
                      <Loader2Icon className="size-4 animate-spin" /> 
                    : 'Confirmar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openDesactiveDialog} onOpenChange={setOpenDesactiveDialog}>
              <AlertDialogTrigger render={
                <Button className="w-[30%] bg-blue-200 text-white" variant={null}>
                  <BanIcon className="text-blue-500"/>
                </Button>}>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer {isAtivacted ? 'desativar' : 'ativar'} este serviço?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    {isAtivacted
                      ? 'Ao desativar, seus clientes não poderão reservar esse serviço. Você pode ativar novamente a qualquer momento!'
                      : 'Ao ativar, seus clientes poderão agendar esse serviço novamente.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="text-white"
                    style={{ backgroundColor: "#dc2626" }}
                    onClick={handleDesactivated}
                  >
                    {isLoadingDesactiveServi ? 
                      <Loader2Icon className="size-4 animate-spin" /> 
                    : 'Confirmar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
    );
}
 
export default ActionsServices;