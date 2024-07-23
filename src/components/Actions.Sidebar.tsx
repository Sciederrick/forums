import Popover from "@mui/material/Popover";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { ActiveSidebarComponent } from "../types";

const Actions = () => {
    const ctx = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(
        null
    );
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleClickCreateForum = () => {
        ctx?.onSetActiveSidebarComponent(ActiveSidebarComponent.newForum);
    };

    return (
        <div>
            <button aria-describedby={id} onClick={handleClick}>
                <MoreVertOutlinedIcon />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <button className="px-3 py-2" onClick={handleClickCreateForum}>
                    Create Forum
                </button>
            </Popover>
        </div>
    );
}

export default Actions;
