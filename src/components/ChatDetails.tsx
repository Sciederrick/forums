import { useContext, useEffect, useState } from "react";
import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import { User } from "../types";
import client from "../lib/feathersClient";

const ChatDetails = () => {
    const ctx = useContext(AppContext);
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const profiles = await client.service("users").find({
                    query: { _id: { $in: ctx?.activeChat?.memberIds } },
                });
                setUsers(profiles.data);
                console.log("🚀 ~ fetchUsers ~ users:", profiles);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching users failed with err: ${err}`);
            }
        };
        fetchUsers();
    }, [ctx?.activeChat]);

    return (
        <div className="lg:w-[540px]">
            <div className="w-full rounded shadow px-3 py-4 flex flex-col gap-4 bg-gray-50">
                <p className="text-xs text-gray-400">
                    Created:{" "}
                    {formatChatTimestamp(ctx?.activeChat?.createdAt ?? 0)}
                </p>
                {ctx?.activeChat?.description ? (
                    <p>{ctx?.activeChat?.description}</p>
                ) : (
                    <p className="text-gray-400">(empty description)</p>
                )}
                <p className="text-sm">
                    {ctx?.activeChat?.memberIds.length}&nbsp;members
                </p>
            </div>
            <div className="mx-auto h-[2px] my-8 bg-gray-100 w-full">
                &nbsp;
            </div>
            <ul className="mx-auto w-full max-h-[50vh] overflow-y-auto">
                {users.map((user: User) => (
                    <li
                        key={user._id}
                        className="flex items-center gap-2 p-2 text-sm my-2 bg-gray-50 rounded cursor-pointer"
                    >
                        <img
                            src={user.avatar}
                            height={32}
                            width={32}
                            className="rounded-full"
                        />
                        <p>{user.email}</p>
                    </li>
                    
                ))}
            </ul>
        </div>
    );
};

export default ChatDetails;
