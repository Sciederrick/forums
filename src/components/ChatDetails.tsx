import { useContext, useEffect, useState } from "react";
import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import { User } from "../types";
import client from "../lib/feathersClient";

import useMessageUser from "../hooks/useMessageUser";

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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching users failed with err: ${err}`);
            }
        };
        fetchUsers();
    }, [ctx?.activeChat]);

    const { messageUser } = useMessageUser(ctx);
    const handleMessageUser = (user: User) => {
        messageUser(user);
        ctx?.onToggleChatDetails();
    };

    const handleShowUserProfile = (id: string) => {
        // Dismiss chat details
        ctx?.onToggleChatDetails();
        ctx?.onSetUserDetailsUserId(id);
    };

    return (
        <div className="lg:w-[540px]">
            <div className="w-full rounded px-3 py-4 flex flex-col gap-4 bg-gray-50">
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
                        className="flex items-center justify-between p-2 text-sm my-2 bg-gray-50 rounded cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={user.avatar}
                                height={32}
                                width={32}
                                className="rounded-full"
                                onClick={() => {
                                    handleShowUserProfile(user._id);
                                }}
                            />
                            {ctx?.loggedInAs?._id == user._id ? (
                                <p>You</p>
                            ) : (
                                <p>
                                    {typeof user.username == "string" &&
                                    user.username.trim().length > 0
                                        ? user.username
                                        : user.email}
                                </p>
                            )}
                        </div>
                        {ctx?.loggedInAs?._id != user._id && (
                            <button
                                className="font-medium underline"
                                onClick={() => handleMessageUser(user)}
                            >
                                Message
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatDetails;
