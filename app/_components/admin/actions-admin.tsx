"use client"

import { Button } from "../ui/button";
import { EditIcon, Loader2Icon, UserRoundX } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

interface ActionsAdminProps {
    handleOpenDialog: () => void;
    openDeleteDialog: boolean;
    setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>
    isLoadingDeleteAdmin: boolean
}

const ActionsAdmin = ({
    handleOpenDialog,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleDelete,
    isLoadingDeleteAdmin
}: ActionsAdminProps) => {
    return (
        <div className="w-[25%]">
          <div className="flex flex-row justify-between items-center gap-1 w-full h-full">
            <Button className="h-[70%] lg:h-full w-[48%] bg-yellow-200 text-yellow-500" variant={null} onClick={handleOpenDialog}>
              <EditIcon />
            </Button>

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <AlertDialogTrigger render={<Button className="h-[70%] lg:h-full w-[48%] bg-red-200" variant={null}><UserRoundX className="text-red-500"/></Button>}>
                
              </AlertDialogTrigger>

              <AlertDialogContent className="w-full ring-1 ring-secondary">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você quer excluir este administrador?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-justify">
                    Ao excluir, você perderá o administrador e não poderá
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
                    {isLoadingDeleteAdmin ? 
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
 
export default ActionsAdmin;