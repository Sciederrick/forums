import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

const LoggedInAs = () => {
    const ctx = useContext(AppContext);
    return (
        <div
            key={ctx?.loggedInAs?._id}
            className="w-full flex justify-between items-center gap-2 p-2 text-sm"
        >
            <img
                src={ctx?.loggedInAs?.avatar}
                height={32}
                width={32}
                className="rounded-full"
                title={ctx?.loggedInAs?.email}
            />
            <button className="flex flex-col items-center"><InboxOutlinedIcon className="text-gray-400"/><p className="text-xs text-gray-400">inbox</p></button>
        </div>
    );
};

export default LoggedInAs;
