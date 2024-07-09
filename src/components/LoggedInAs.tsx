import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const LoggedInAs = () => {
    const ctx = useContext(AppContext);
    return (
        <div key={ctx?.loggedInAs?._id} className="flex items-center gap-2 p-2 text-sm -ml-4">
            <img
                src={ctx?.loggedInAs?.avatar}
                height={32}
                width={32}
                className="rounded-full"
            />
            <p>{ctx?.loggedInAs?.email}</p>
        </div>
    );
};

export default LoggedInAs;
