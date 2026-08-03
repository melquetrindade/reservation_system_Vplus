"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { BookUser, HomeIcon, LockIcon, LogOutIcon} from "lucide-react";
import Link from "next/link";
import Image from "next/image"

const SiderbarDesktopAdmin = () => {
  const { data } = useSession();
  const handleLogoutClick = () => signOut();

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

        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-300">
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
                <p className="font-bold">{data.user.name}</p>
                <p className="text-xs">{data.user.email}</p>
                </div>
            </div>
            ) : null}
        </div>

        <div className="flex-1 flex-col px-3 py-4 space-y-1">
            <div className="flex flex-col gap-2">
                <Button
                    className="gap-2 justify-start"
                    variant="ghost"
                >
                    <HomeIcon />
                    <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
                
                <Button
                    className="gap-2 justify-start"
                    variant="ghost"
                >
                    <BookUser />
                    <Link href="/admin/professionals">Profissionais</Link>
                </Button>

                {data?.user.adminRole === 'OWNER' ? (
                <Button
                    className="gap-2 justify-start"
                    variant="ghost"
                >
                    <LockIcon />
                    <Link href="/admin/owners">Administradores</Link>
                </Button>
                ) : null}
            </div>
            
        </div>

        <div className="px-3 py-4 border-t border-gray-300">
            <Button
                className="w-full gap-3 justify-start py-5"
                onClick={handleLogoutClick}
            >
                <LogOutIcon size={18} />
                Sair da sessão
            </Button>
        </div>
    </aside>
  );
};

export default SiderbarDesktopAdmin;
