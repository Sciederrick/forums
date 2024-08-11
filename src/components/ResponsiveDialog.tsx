import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { AppContext } from "../contexts/AppContext";
import ChatDetails from "./ChatDetails";

export default function ResponsiveDialog() {
    const ctx = React.useContext(AppContext);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

    const handleClose = () => {
        ctx?.onToggleGroupDetails();
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={ctx?.showGroupDetails ?? false}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle className="flex justify-between items-center" id="responsive-dialog-title">
                    {"Contact Info"}
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Dismiss
                    </Button>
                </DialogActions>
                </DialogTitle>
                <DialogContent>
                    <ChatDetails />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
