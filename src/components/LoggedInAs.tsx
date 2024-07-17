import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import AddForum from "./AddForum";

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
                className="rounded-full cursor-pointer"
                title={ctx?.loggedInAs?.email}
            />
            <AddForum />
        </div>
    );
};

export default LoggedInAs;
