import { Disponibilidade, Servico, User } from "@prisma/client";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ClockIcon, Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInDialog from "./sign-in-dialog";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { format, set } from "date-fns";

const formatBrazilTime = (value: Date | string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
};
import { getUser } from "@/app/_actions/get-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PhoneClientSchema,
  phoneClientSchema,
} from "@/app/schema/phone-client-schema";
import { toast } from "sonner";
import { createPhone } from "@/app/_actions/create-phone-client";
import { getTimeList } from "@/app/_actions/get-time-list";
import { createAgendamento } from "@/app/_actions/create-agendamento";
import SummaryReserva from "./summary-reserva";
import PhoneDialog from "./phone-dialog";

interface ServiceItemProps {
  service: Servico;
  professionalName: string;
  professionalId: string;
}

const ServiceItem = ({
  service,
  professionalName,
  professionalId,
}: ServiceItemProps) => {
  const { data } = useSession();
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false);
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [client, setClient] = useState<User | null>();
  const [signInDialogIsOpenPhone, setSignInDialogIsOpenPhone] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Disponibilidade | null>(
    null,
  );
  const [timeList, setTimeList] = useState<Disponibilidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);

  const form = useForm<PhoneClientSchema>({
    resolver: zodResolver(phoneClientSchema),
    defaultValues: {
      telefone: "",
    },
  });

  const onSubmit = async (dataPhone: PhoneClientSchema) => {
    try {
      if (!data?.user?.id) {
        toast.error("Usuário não identificado.");
        return;
      }

      const formData = new FormData();
      formData.append("telefone", dataPhone.telefone ?? "");

      const phone = await createPhone(formData, data.user.id);
      setClient((old) => {
        if (!old) return old;

        return {
          ...old,
          telefone: phone,
        };
      });

      form.reset();
      setSignInDialogIsOpenPhone(false);
      setBookingSheetIsOpen(true);
      toast.success("Telefone cadastrado com sucesso!", {
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
        toast.error("Erro ao cadastrar telefone.");
      }
    }
  };

  const handleBookingSheetOpenChange = () => {
    setBookingSheetIsOpen(false);
    setSelectedDay(undefined);
    setSelectedTime(null);
    setTimeList([]);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: Disponibilidade) => {
    setSelectedTime(time);
  };

  const handleBookingClick = () => {
    if (data?.user && client?.telefone) {
      return setBookingSheetIsOpen(true);
    } else if (!data?.user) {
      return setSignInDialogIsOpen(true);
    }
    return setSignInDialogIsOpenPhone(true);
  };

  const fetchUser = async (id: string) => {
    const client = await getUser(id);
    setClient(client);
  };

  useEffect(() => {
    if (data?.user?.id) {
      fetchUser(data.user.id);
    }
  }, [data?.user?.id]);

  useEffect(() => {
    const fetchTimeList = async () => {
      if (!selectedDay) return;
      setIsLoading(true);
      try {
        const horarios = await getTimeList({ professionalId, selectedDay });
        setTimeList(horarios);
      } catch (error) {
        console.error(error);
        setTimeList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeList();
  }, [selectedDay, professionalId]);

  const handleCreateAgendamento = async () => {
    try {
      if (!selectedDate) {
        return;
      }

      setIsLoadingConfirm(true);
      await createAgendamento({
        servicoId: service.id,
        disponibilidadeId: selectedTime?.id!,
      });
      handleBookingSheetOpenChange();
      toast.success("Reserva criada com sucesso!", {
        style: {
          background: "#22c55e",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Error ao criar reserva!", {
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoadingConfirm(false);
    }
  };

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return null;
    const horaInicio = new Date(selectedTime.horaInicio);
    return set(selectedDay, {
      hours: horaInicio.getHours(),
      minutes: horaInicio.getMinutes(),
    });
  }, [selectedDay, selectedTime]);

  return (
    <>
      <Card className="ring-0">
        <CardContent className="flex items-center gap-3">
          {/*Imagem */}
          <div className="relative max-h-27.5 min-h-27.5 min-w-27.5 max-w-27.5">
            <Image
              alt={service.nome}
              src={service.imgURL!}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/*Direita */}
          <div className="space-y-2 w-full">
            <h3 className="font-semibold text-sm">{service.nome}</h3>
            <div className="flex gap-2">
              <ClockIcon className="text-gray-500" size={20} />
              <p className="text-sm text-gray-500">{service.tempo}</p>
            </div>

            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.preco))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  onClick={handleBookingClick}
                  variant="secondary"
                  size="sm"
                >
                  Reservar
                </Button>

                <SheetContent className="px-0 flex h-full flex-col">
                  <SheetHeader>
                    <SheetTitle className="text-center font-bold text-lg">
                      Fazer Reserva
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <div className="px-5 pb-4 flex justify-center">
                      <div className="w-full max-w-87.5">
                        <Calendar
                          mode="single"
                          selected={selectedDay}
                          onSelect={handleDateSelect}
                          locale={ptBR}
                          disabled={{ before: new Date() }}
                          className="rounded-2xl w-full"
                          classNames={{
                            root: "w-full",
                            weekday:
                              "flex-1 capitalize text-center font-medium text-sm py-1",
                            day: "flex-1",
                            month_caption:
                              "flex justify-center items-center text-center capitalize font-semibold text-base py-1",
                            button_previous: "h-10 w-10",
                            button_next: "h-10 w-10",
                            week: "mt-2 flex w-full gap-1",
                            month_grid: "w-full border-collapse",
                          }}
                        />
                      </div>
                    </div>

                    {selectedDay && isLoading ? (
                      <div className="flex flex-col items-center">
                        <Loader2Icon className="size-4 animate-spin" />
                        <p className="text-xs">Carregando horários</p>
                      </div>
                    ) : timeList.length > 0 ? (
                      <div className="py-4 border border-solid px-5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-2">
                        {timeList.map((time) => (
                          <Button
                            key={time.id}
                            variant={
                              selectedTime?.id === time.id
                                ? "default"
                                : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {formatBrazilTime(time.horaInicio)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      </div>
                    )}

                    {selectedDate && (
                      <div className="p-5">
                        <SummaryReserva
                          service={service}
                          selectedDate={selectedDate}
                          professionalName={professionalName}
                        />
                      </div>
                    )}
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      disabled={
                        !selectedDay || !selectedTime || isLoadingConfirm
                      }
                      onClick={handleCreateAgendamento}
                    >
                      {isLoadingConfirm ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>

      <Dialog
        open={signInDialogIsOpenPhone}
        onOpenChange={(open) => setSignInDialogIsOpenPhone(open)}
      >
        <DialogContent className="w-[90%]">
          <PhoneDialog form={form} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceItem;