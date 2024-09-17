import Messages from "./components/Messages.tsx";
import Chats from "./components/Chats.Sidebar.tsx";
import Auth from "./components/Auth";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import NewForum from "./components/NewForum.Sidebar.tsx";
import { ActiveSidebarComponent } from "./types/index.ts";
import ResponsiveDialog from "./components/ResponsiveDialog.tsx";
import ChatDetails from "./components/ChatDetails.tsx";
import ContactDetails from "./components/ContactDetails.tsx";

const App = () => {
    const ctx = useContext(AppContext);

    const handleCloseGroupInfoDialog = () => {
        ctx?.onToggleGroupDetails();
    };

    const handleCloseContactInfoDialog = () => {
        ctx?.onSetUserDetailsUserId(null);
    };
    return (
        <>
            {ctx?.isShowAuth ? (
                <Auth />
            ) : (
                <>
                    <ResponsiveDrawer
                        profiles={
                            ctx?.activeSidebarComponent ==
                            ActiveSidebarComponent.newForum ? (
                                <NewForum />
                            ) : (
                                <Chats />
                            )
                        }
                        messages={<Messages />}
                    />
                    <ResponsiveDialog
                        title={
                            ctx?.activeChat?.type == "group"
                                ? "Group Info"
                                : "Chat Info"
                        }
                        component={<ChatDetails />}
                        isOpen={ctx?.showGroupDetails ?? false}
                        onHandleClose={handleCloseGroupInfoDialog}
                    />
                    <ResponsiveDialog
                        title="Contact Info"
                        component={<ContactDetails />}
                        isOpen={ctx?.userDetailsUserId != null}
                        onHandleClose={handleCloseContactInfoDialog}
                    />
                </>
            )}
        </>
    );
};

export default App;
