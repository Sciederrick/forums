import { Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const TitleBar = () => {
    const ctx = useContext(AppContext);

    const handleClickChatDetails = () => {
        ctx?.onToggleGroupDetails();
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
            {ctx?.activeChat?.name}&nbsp;
            {ctx?.activeChat && <InfoOutlinedIcon color="disabled" />}
        </Typography>
    );
};

export default TitleBar;
