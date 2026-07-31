import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import Header from "@/app/_components/admin/header";
import ListAdmin from "@/app/_components/admin/list-admin";
import SiderbarDesktopAdmin from "@/app/_components/admin/siderbar-desktop-admin";

export default async function OwnersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/admin");
  }

  // Apenas administradores com role = "OWNER" podem acessar
  if (session.user.adminRole !== "OWNER") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="lg:min-h-screen lg:overflow-hidden">
      <SiderbarDesktopAdmin/>
      <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
        <Header />
        <ListAdmin/>
      </div>
    </div>
  );
}
