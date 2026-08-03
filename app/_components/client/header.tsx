import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SiderbarSheetClient from './siderbar-sheet-client'
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <Card className="rounded-none ring-0 pt-2 pb-2 lg:hidden">
            <CardContent className="flex flex-row items-center justify-between">
                <div className="relative h-13 w-11">
                    <Link href="/">
                        <Image
                            alt="Logo Salão de beleza"
                            src="/logo_dark_1.png"
                            fill
                            priority
                        />
                    </Link>
                </div>
            <Sheet>
                <SheetTrigger>
                <Button size="icon" variant="secondary">
                    <MenuIcon />
                </Button>
                </SheetTrigger>

                <SiderbarSheetClient />
            </Sheet>
            </CardContent>
        </Card>
    );
}
 
export default Header;