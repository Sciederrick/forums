import Popover from "@mui/material/Popover";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useState } from "react";
import { User } from "../types";

type Props = {
    user: User;
    onMessageUser: () => void;
};
const Actions = ({user, onMessageUser}:Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

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
                <button
                    className="font-medium py-2 px-3"
                    onClick={onMessageUser}
                >
                    Message {user.username || user.email}
                </button>
            </Popover>
        </div>
    );
};

export default Actions;
