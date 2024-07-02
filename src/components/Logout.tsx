/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from "@mui/material";
import IconLogout from "@mui/icons-material/Logout";
import client from "../lib/feathersClient";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const Logout = () => {
    const ctx = useContext(AppContext);

    const logout = async () => {
        try {
            await client.logout();
            ctx?.onSetShowAuth(true);
        } catch(err: any) {
            ctx?.onNotif(`Logout failed with err: ${err}`)
        }
    }
    
    return (
        <IconButton
            color="inherit"
            aria-label="logout"
            edge="end"
            sx={{ ml: 2 }}
            onClick={logout}
        >
            <IconLogout />
        </IconButton>
    );
}

export default Logout;