import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import client from "../lib/feathersClient";
import { User } from "../types";
import { AppContext } from "../contexts/AppContext";
import { Divider } from "@mui/material";

const NewGroup = () => {
    const ctx = useContext(AppContext);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const value = e.target.value;
        setSearchTerm(value);
    };
    const handleToggleSearch = () => {
        setShowSearch((prevState) => !prevState);
    };

    const searchUsers = debounce(async (email) => {
        try {
            if (email) {
                const response = await client.service("users").find({
                    query: {
                        // email: { $regex: new RegExp(email, 'i')},
                        email,
                        $limit: 10,
                    },
                });
                setUsers(response.data);
            } else {
                setUsers([]);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`failed to search users with err: ${err}`);
        }
    }, 300);

    const getAllUsers = async () => {
        try {
            const response = await client.service("users").find();
            setUsers(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`failed to fetch users with err: ${err}`);
        }
    };

    const [isAlreadyExecuted, setIsAlreadyExecuted] = useState(false);
    useEffect(() => {
        // Get all users on mounted
        if (!isAlreadyExecuted) {
            console.log(
                "🚀 ~ useEffect ~ isAlreadyExecuted:",
                isAlreadyExecuted
            );
            getAllUsers();
            setIsAlreadyExecuted(true);
        } else {
            console.log(
                "🚀 ~ useEffect ~ isAlreadyExecuted:",
                isAlreadyExecuted
            );
            // Search users on search
            // searchUsers(searchTerm);
        }
    }, [searchTerm]);
    return (
        <>
            <div className="flex justify-between gap-2 px-3 py-4">
                <div className="flex items-center gap-4">
                    {showSearch ? (
                        <>
                            <button onClick={handleToggleSearch}>
                                <ArrowBackIosOutlinedIcon />
                            </button>
                            <input
                                onChange={handleChange}
                                id="search"
                                name="search"
                                autoComplete="true"
                                placeholder="type to search ..."
                                className="w-full h-[32px] focus:outline-none"
                                autoFocus
                            />
                        </>
                    ) : (
                        <div className="h-[32px] flex flex-col justify-center pl-3">
                            <p>New Forum</p>
                            <p className="text-sm">Add humans</p>
                        </div>
                    )}
                </div>
                {!showSearch && (
                    <button onClick={handleToggleSearch}>
                        <SearchOutlinedIcon />
                    </button>
                )}
            </div>
            <Divider />
            <ul>
                {users.map((user) => (
                    <li
                        key={user._id}
                        className="flex items-center gap-2 p-4 text-sm cursor-pointer hover:bg-gray-100"
                    >
                        <img
                            src={user.avatar}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <p>{user.email}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default NewGroup;
