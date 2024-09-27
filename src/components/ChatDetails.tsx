import { useContext, useEffect, useState } from "react";
import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import { Chat, User } from "../types";
import client from "../lib/feathersClient";

import useMessageUser from "../hooks/useMessageUser";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

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

    type Edit = "Name" | "Description" | "Members";
    type Process = Edit;
    const [isProcessing, setIsProcessing] = useState<Process | null>(null);
    const [isEditChat, setIsEditChat] = useState<Edit | null>(null);
    const [name, setName] = useState<string | null>(
        ctx?.activeChat?.name ?? null
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeName = (e: any) => {
        setName(e.target.value);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateName = async (e: any) => {
        try {
            if (!ctx?.activeChat?._id) throw Error("chat id empty");
            if (!name || name.trim().length == 0) throw Error("invalid name");
            if (e.key === "Enter") {
                e.currentTarget.blur();
                setIsProcessing("Name");
                await client
                    .service("chats")
                    .patch(ctx.activeChat._id, { name });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Updating name failed with error: ${err}`);
        } finally {
            setIsProcessing(null);
        }
    };

    const [description, setDescription] = useState<string | null>(
        ctx?.activeChat?.description ?? null
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateDescription = async (e: any) => {
        try {
            if (!ctx?.activeChat?._id) throw Error("chat id empty");
            if (!description || description.trim().length == 0) throw Error("invalid description");
            if (e.key === "Enter") {
                e.currentTarget.blur();
                setIsProcessing("Description");
                await client
                    .service("chats")
                    .patch(ctx.activeChat._id, { description });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Updating description failed with error: ${err}`);
        } finally {
            setIsProcessing(null);
        }
    };

    // Switch of edit mode on input blur
    const handleInputBlur = () => {
        setIsEditChat(null);
    };
    const handleEditChat = (section: Edit | null) => {
        setIsEditChat(section);
    };

    useEffect(() => {
        client.service("chats").on("patched", (chat: Chat) => {
            ctx?.onSetActiveChat(chat);
        });
        return () => {
            client.service("chats").removeListener("patched");
        };
    }, []);

    return (
        <div className="w-full h-[75vh] bg-white rounded-t-3xl">
            <div className="w-full px-3 py-4 mt-4 flex flex-col gap-4 bg-gray-50 max-w-3xl mx-auto text-center">
                {isProcessing === "Name" ? (
                    <div className="w-[125px] h-[16px] bg-gray-300 animate-pulse inline-block">
                        &nbsp;
                    </div>
                ) : (
                    <>
                        {isEditChat == "Name" &&
                        ctx?.activeChat?.type === "group" ? (
                            <div className="flex max-w-md mx-auto ">
                                <input
                                    type="text"
                                    className="border-b bg-transparent border-blue-200 outline-none"
                                    value={name ?? ""}
                                    onChange={handleChangeName}
                                    onKeyDown={handleUpdateName}
                                    onBlur={handleInputBlur}
                                    placeholder="username"
                                />
                                <button
                                    className="px-2 text-gray-500"
                                    onClick={() => handleEditChat(null)}
                                >
                                    <HighlightOffOutlinedIcon className="text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 justify-center">
                                <h2 className="text-2xl">
                                    {ctx?.activeChat?.name}
                                </h2>
                                <button
                                    className="px-2 text-gray-500"
                                    onClick={() => handleEditChat("Name")}
                                >
                                    <EditOutlinedIcon />
                                </button>
                            </div>
                        )}
                    </>
                )}
                <p className="text-xs text-gray-400">
                    Created:{" "}
                    {formatChatTimestamp(ctx?.activeChat?.createdAt ?? 0)}
                </p>
                {isProcessing === "Description" &&
                ctx?.activeChat?.type === "group" ? (
                    <div className="w-[125px] h-[16px] bg-gray-300 animate-pulse inline-block">
                        &nbsp;
                    </div>
                ) : (
                    <div className="flex gap-2 justify-center">
                        {isEditChat === "Description" ? (
                            <textarea
                                className="border-b bg-transparent border-blue-200 outline-none w-full max-w-xl mx-auto text-center"
                                value={description ?? ""}
                                onChange={handleChangeDescription}
                                onKeyDown={handleUpdateDescription}
                                onBlur={handleInputBlur}
                                placeholder="description"
                            ></textarea>
                        ) : (
                            <>
                                {ctx?.activeChat?.description ? (
                                    <p>{ctx?.activeChat?.description}</p>
                                ) : (
                                    <p className="text-gray-400">
                                        (empty description)
                                    </p>
                                )}
                                <button
                                    className="px-2 text-gray-500"
                                    onClick={() =>
                                        handleEditChat("Description")
                                    }
                                >
                                    <EditOutlinedIcon />
                                </button>
                            </>
                        )}
                    </div>
                )}
                <p className="text-sm">
                    {ctx?.activeChat?.memberIds.length}&nbsp;members
                </p>
            </div>
            <div className="mx-auto h-[2px] my-8 bg-gray-100 w-full max-w-3xl">
                &nbsp;
            </div>
            <ul className="mx-auto w-full max-h-[50vh] overflow-y-auto max-w-3xl">
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
