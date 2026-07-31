import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger } from "../ui/sheet";
import SiderbarSheetAdmin from "./siderbar-sheet-admin";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <Card className="rounded-none ring-0 bg-primary pt-2 pb-2 lg:hidden">
      <CardContent className="flex flex-row items-center justify-between">
        <div className="relative h-13 w-11">
        <Link href="/admin/dashboard">
        
          <Image
            alt="Logo Salão de beleza"
            src="/logo_oficialV2_2.png"
            fill
            priority
          />

        </Link>
        </div>

        <Sheet>
          <SheetTrigger>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SiderbarSheetAdmin />
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
