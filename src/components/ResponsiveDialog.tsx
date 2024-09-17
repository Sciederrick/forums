import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface Props {
    title: string;
    component: React.ReactNode;
    isOpen: boolean;
    onHandleClose: () => void;
}

const ResponsiveDialog: React.FC<Props> = ({
    title,
    component,
    isOpen,
    onHandleClose,
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={isOpen}
                onClose={onHandleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    className="flex justify-between items-center"
                    id="responsive-dialog-title"
                >
                    {title}
                    <DialogActions>
                        <Button autoFocus onClick={onHandleClose}>
                            Dismiss
                        </Button>
                    </DialogActions>
                </DialogTitle>
                <DialogContent>{component}</DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default ResponsiveDialog;
