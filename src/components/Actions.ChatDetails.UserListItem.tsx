import Popover from "@mui/material/Popover";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useState } from "react";
import { User } from "../types";

type Props = {
    user: User;
    onMessageUser: () => void;
    onRemoveUser: () => void;
};
const Actions = ({ user, onMessageUser, onRemoveUser }: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleRemoveUser = () => {
        onRemoveUser()
        handleClose()
    }
    const handleMessageUser = () => {
        onMessageUser()
        handleClose()
    }

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
                <div className="flex flex-col">
                    <button
                        className="font-medium py-2 px-3 text-sm"
                        onClick={handleMessageUser}
                    >
                        Message {user.username || user.email}
                    </button>
                    <hr />
                    <button
                        className="font-medium py-2 px-3 text-sm"
                        onClick={handleRemoveUser}
                    >
                        Remove {user.username || user.email}
                    </button>
                </div>
            </Popover>
        </div>
    );
};

export default Actions;
