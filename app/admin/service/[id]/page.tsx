import Header from "@/app/_components/admin/header";
import ListServices from "@/app/_components/admin/list-services";
import SiderbarDesktopAdmin from "@/app/_components/admin/siderbar-desktop-admin";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ServicePageProps{
    params: Promise<{
        id: string
    }>
}

const ServicePage = async ({params}: ServicePageProps) => {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
        redirect("/admin");
    }

    const { id } = await params;

    return (
        <div className="lg:min-h-screen lg:overflow-hidden">
            <SiderbarDesktopAdmin/>
            <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
                <Header/>
                <ListServices id={id}/>
            </div>
        </div>
        
    );
}
 
export default ServicePage;
