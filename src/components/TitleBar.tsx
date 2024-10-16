import { Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const TitleBar = () => {
    const ctx = useContext(AppContext);

    const handleClickChatDetails = () => {
        if (ctx?.activeChat && ctx?.activeChat.type == "group") {
            ctx?.onToggleChatDetails();
        }
    };

    return (
        <Typography
            variant="h6"
            noWrap
            component="div"
            className="text-ellipsis overflow-hidden flex items-center cursor-pointer"
            title={ctx?.activeChat?.name}
            onClick={handleClickChatDetails}
        >
            {ctx?.activeChat?.name ?? ""}&nbsp;
            {ctx?.activeChat && ctx?.activeChat.type == "group" && <InfoOutlinedIcon color="disabled" />}
        </Typography>
    );
};

export default TitleBar;
