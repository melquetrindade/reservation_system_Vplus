import { Profissional } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProfessioanlItemProps {
  professional: Profissional;
}

const ProfessionalItem = ({professional}: ProfessioanlItemProps) => {

    return (
        <Card className="min-w-41.75 rounded-2xl border-secondary bg-secondary ring-0 pt-0">
            <CardContent className="w-full px-1 pt-1">
                
                {/*Imagem */}
                <div className="relative h-44.75 w-full">
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
                </div>

                {/*Texto */}
                <div className="py-3 px-1 flex justify-center">
                    <h3 className="truncate font-semibold text-xs">{professional.nome}</h3>
                </div>

                {/*Reservar */}
                <div className="flex justify-center w-full">
                    <Link href={`/services/${professional.id}`} className="w-[90%]">
                        <Button size="xs" className="w-full">
                            <p className="text-xs">Serviços</p>
                        </Button>
                    </Link>
                </div>
                
            </CardContent>
    </Card>
  );
};

export default ProfessionalItem;
