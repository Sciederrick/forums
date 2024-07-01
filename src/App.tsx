import Chat from "./components/Chat";
import ChatProfiles from "./components/ChatProfiles";
import Auth from "./components/Auth";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";

const App = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx?.isShowAuth ? (
                <Auth />
            ) : (
                <ResponsiveDrawer
                    profiles={<ChatProfiles />}
                    messages={<Chat />}
                />
            )}
        </>
    );
};

export default App;
