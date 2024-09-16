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
    onSetActiveChat: (chat: Chat | undefined) => void;
    showGroupDetails: boolean;
    onToggleGroupDetails: () => void;
    userDetailsUserId: string | null;
    onSetUserDetailsUserId: (id: string | null) => void;
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
    const handleSetActiveChat = (chat: Chat | undefined) => {
        setActiveChat(chat);
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

    const [userDetailsUserId, setUserDetailsUserId] = useState<string | null>(null);
    const handleSetUserDetailsUserId = (id: string | null) => {
        setUserDetailsUserId(id);
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
                userDetailsUserId,
                onSetUserDetailsUserId: handleSetUserDetailsUserId,
            }}
        >
            {children}
            <ToastContainer />
        </AppContext.Provider>
    );
};
