import { ReactNode, createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ActiveSidebarComponent, Chat, User } from "../types";

export type TypeAppContext = {
    onNotif: (msg: string) => void;
    isShowAuth: boolean;
    onSetShowAuth: (state: boolean) => void;
    loggedInAs?: User;
    onSetLoggedInUser: (user: User) => void;
    activeChat: Chat | undefined;
    onSetActiveChat: (chat: Chat | undefined) => void;
    showChatDetails: boolean;
    onToggleChatDetails: () => void;
    userDetailsUserId: string | null;
    onSetUserDetailsUserId: (id: string | null) => void;
    activeSidebarComponent: ActiveSidebarComponent;
    onSetActiveSidebarComponent: (component: ActiveSidebarComponent) => void;
    iJustLeftThisForum: string | null;
    onSetIJustLeftThisForum: (forumId: string | null) => void;
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

    const [iJustLeftThisForum, setIJustLeftThisForum] = useState<string | null>(null);
    const handleSetIJustLeftThisForum = (forumId: string | null) => {
        setIJustLeftThisForum(forumId);
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
                showChatDetails: showGroupDetails,
                onToggleChatDetails: handleToggleGroupDetails,
                activeSidebarComponent,
                onSetActiveSidebarComponent: handleSetActiveSidebarComponent,
                userDetailsUserId,
                onSetUserDetailsUserId: handleSetUserDetailsUserId,
                iJustLeftThisForum,
                onSetIJustLeftThisForum: handleSetIJustLeftThisForum,
            }}
        >
            {children}
            <ToastContainer />
        </AppContext.Provider>
    );
};
