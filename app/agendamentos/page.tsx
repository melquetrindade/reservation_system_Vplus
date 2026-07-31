import ContainerPageAgendamentos from "../_components/client/container-page-agendamentos";
import Header from "../_components/client/header";
import SidebarDesktop from "../_components/client/sidebar-desktop";

const AgendamentosPage = async () => {

    return (
        <div className="lg:min-h-screen lg:overflow-hidden">
            <SidebarDesktop />

            <div className="flex flex-col min-h-screen lg:ml-72 lg:overflow-y-auto">
                <Header/>
                <ContainerPageAgendamentos/>
            </div>
            
        </div>
    );
}
 
export default AgendamentosPage;