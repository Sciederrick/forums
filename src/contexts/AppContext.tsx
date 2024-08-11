import { ReactNode, createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ActiveSidebarComponent, Chat, User } from "../types";

type TypeAppContext = {
    onNotif: (msg: string) => void;
    isShowAuth: boolean;
    onSetShowAuth: (state: boolean) => void;
    loggedInAs?: User;
    onSetLoggedInUser: (user: User) => void;
    activeChat: Chat | undefined;
    onSetActiveChat: (id: Chat | undefined) => void;
    showGroupDetails: boolean;
    onToggleGroupDetails: () => void;
    activeSidebarComponent: ActiveSidebarComponent;
    onSetActiveSidebarComponent: (component: ActiveSidebarComponent) => void;
};

export const AppContext = createContext<TypeAppContext | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [isShowAuth, setIsShowAuth] = useState(true);
    const handleSetShowAuth = (state: boolean) => {
        setIsShowAuth(state);
    };

    const handleNotif = (msg: string) => {
        toast(msg);
    };

    const [loggedInAs, setLoggedInUser] = useState<User>();
    const handleSetLoggedInUser = (user: User) => {
        setLoggedInUser(user);
    };

    const [activeChat, setActiveChat] = useState<Chat>();
    const handleSetActiveChat = (id: Chat | undefined) => {
        setActiveChat(id);
    };

    const [showGroupDetails, setShowGroupDetails] = useState(false);
    const handleToggleGroupDetails = () => {
        setShowGroupDetails((prevState) => !prevState);
    };

    const [activeSidebarComponent, setActiveSidebarComponent] = useState(
        ActiveSidebarComponent.groupChat
    );
    const handleSetActiveSidebarComponent = (
        component: ActiveSidebarComponent
    ) => {
        setActiveSidebarComponent(component);
    };

    return (
        <AppContext.Provider
            value={{
                onNotif: handleNotif,
                isShowAuth,
                onSetShowAuth: handleSetShowAuth,
                loggedInAs,
                onSetLoggedInUser: handleSetLoggedInUser,
                activeChat,
                onSetActiveChat: handleSetActiveChat,
                showGroupDetails,
                onToggleGroupDetails: handleToggleGroupDetails,
                activeSidebarComponent,
                onSetActiveSidebarComponent: handleSetActiveSidebarComponent,
            }}
        >
            {children}
            <ToastContainer />
        </AppContext.Provider>
    );
};
