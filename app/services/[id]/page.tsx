import ContainerPageServices from "@/app/_components/client/container-page-services";
import Header from "@/app/_components/client/header";
import SidebarDesktop from "@/app/_components/client/sidebar-desktop";

interface ServicesPageProps{
    params: Promise<{
        id: string
    }>
}

const ServicePage = async ({params}: ServicesPageProps) => {
    const { id } = await params;

    return (
        <div className="lg:min-h-screen lg:overflow-hidden">
            <SidebarDesktop />

            <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
                <Header/>
                <ContainerPageServices id={id}/>
            </div>
        </div>
        
    );
}
 
export default ServicePage;