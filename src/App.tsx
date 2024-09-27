import Messages from "./components/Messages.tsx";
import Chats from "./components/Chats.Sidebar.tsx";
import Auth from "./components/Auth";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import NewForum from "./components/NewForum.Sidebar.tsx";
import { ActiveSidebarComponent } from "./types/index.ts";
// import ResponsiveDialog from "./components/ResponsiveDialog.tsx";
import ChatDetails from "./components/ChatDetails.tsx";
import ContactDetails from "./components/ContactDetails.tsx";
import { Drawer } from "@mui/material";

const App = () => {
    const ctx = useContext(AppContext);

    const closeModal = () => {
        if (ctx?.showChatDetails) {
            ctx?.onToggleChatDetails();
        } else {
            ctx?.onSetUserDetailsUserId(null);
        }
    }
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
                    <Drawer
                        anchor={"bottom"}
                        open={
                            ctx?.showChatDetails ||
                            ctx?.userDetailsUserId != null
                        }
                        onClose={closeModal}
                        sx={{
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: '99.99vw',
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                                margin: 'auto'
                            },
                        }}
                    >
                        {ctx?.showChatDetails && <ChatDetails />}
                        {ctx?.userDetailsUserId != null && <ContactDetails />}
                    </Drawer>
                </>
            )}
        </>
    );
};

export default App;
