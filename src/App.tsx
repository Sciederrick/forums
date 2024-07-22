import Messages from "./components/Messages.tsx";
import Chats from "./components/Chats.tsx";
import Auth from "./components/Auth";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import NewGroup from "./components/NewForum.tsx";

const App = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx?.isShowAuth ? (
                <Auth />
            ) : (
                <ResponsiveDrawer
                    profiles={true ? <NewGroup /> : <Chats />}
                    messages={<Messages />}
                />
            )}
        </>
    );
};

export default App;
