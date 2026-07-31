import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import Header from "@/app/_components/admin/header";
import ListProfessionals from "@/app/_components/admin/list-professionals";
import SiderbarDesktopAdmin from "@/app/_components/admin/siderbar-desktop-admin";

const Profissionais = async () => {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
        redirect("/admin");
    }

    return (
        <div className="lg:min-h-screen lg:overflow-hidden">
            <SiderbarDesktopAdmin/>
            
            <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
                <Header/>
                <ListProfessionals/>
            </div>
        </div>
    );
}
 
export default Profissionais;