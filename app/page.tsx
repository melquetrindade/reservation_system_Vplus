import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "./_components/client/header";
import SidebarDesktop from "./_components/client/sidebar-desktop";
import ContainerPageInitial from "./_components/client/container-page-initial";


export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="lg:min-h-screen lg:overflow-hidden">
      <SidebarDesktop />

      <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
        <Header/>

        {/*Mensagem de boas-vindas */}
        <div className="p-5 lg:flex lg:flex-col lg:items-end lg:pr-7">
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

        <ContainerPageInitial/>
      </div>
    </div>
  );
}