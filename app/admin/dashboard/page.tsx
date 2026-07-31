import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/app/_components/admin/header";
import ContainerPageDashboard from "@/app/_components/admin/container-page-dashboard";
import SiderbarDesktopAdmin from "@/app/_components/admin/siderbar-desktop-admin";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div className="lg:min-h-screen lg:overflow-hidden">
      <SiderbarDesktopAdmin/>

      <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
        <Header />

        {/*Mensagem de boas-vindas */}
        <div className="p-5">
          <h2 className="text-xl font-bold">
            Olá, {session?.user ? session.user.name : "bem-vindo"}!
          </h2>
          <p>
            <span className="capitalize">
              {format(new Date(), "EEEE, dd", { locale: ptBR })}
            </span>{" "}
            de{" "}
            <span className="capitalize">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>
          </p>
        </div>

        <ContainerPageDashboard/>
      </div>
    </div>
  );
}
