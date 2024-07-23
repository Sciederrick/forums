import Messages from "./components/Messages.tsx";
import Chats from "./components/Chats.Sidebar.tsx";
import Auth from "./components/Auth";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import NewForum from "./components/NewForum.Sidebar.tsx";
import { ActiveSidebarComponent } from "./types/index.ts";

const App = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx?.isShowAuth ? (
                <Auth />
            ) : (
                <ResponsiveDrawer
                    profiles={ctx?.activeSidebarComponent == ActiveSidebarComponent.newForum ? <NewForum /> : <Chats />}
                    messages={<Messages />}
                />
            )}
        </>
    );
};

export default App;
