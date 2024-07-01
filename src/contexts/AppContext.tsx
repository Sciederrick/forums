import { ReactNode, createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TypeAppContext = {
    onNotif: (msg: string) => void;
    isShowAuth: boolean;
    onSetShowAuth: (state: boolean) => void;
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

    return (
        <AppContext.Provider
            value={{
                onNotif: handleNotif,
                isShowAuth,
                onSetShowAuth: handleSetShowAuth
            }}
        >
            {children}
            <ToastContainer />
        </AppContext.Provider>
    );
};
