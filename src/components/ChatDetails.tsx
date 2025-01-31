import { useContext, useEffect, useMemo, useState } from "react";
import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import { Chat, User } from "../types";
import client from "../lib/feathersClient";

import useMessageUser from "../hooks/useMessageUser";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

import { debounce } from "lodash";

import UserListItem from "./ChatDetails.UserListItem";

const ChatDetails = () => {
    const ctx = useContext(AppContext);
    const [users, setUsers] = useState<User[]>([]);
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
    useEffect(() => {
		(async () => {
			await fetchUsers();
		})()

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
            if (!description || description.trim().length == 0)
                throw Error("invalid description");
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

    // Add members to the group/forum
    const handleToggleSearchMode = async () => {        
        if (searchMode == "ForumUserSearch") {
            // Default
            handleUpdateSearchMode("GlobalUserSearch"); 
			if (searchQuery != '') searchUsersGlobally(searchQuery);
        } else {
            // Reset to default
            handleUpdateSearchMode("ForumUserSearch");
			fetchUsers();
        }
    };
	const [newMemberIds, setNewMemberIds] = useState<string[]>([]);
	const handleUpdateNewMemberIds = (newMemberId: string) => {
		const foundMember = newMemberIds.find((memberId) => {
			return memberId == newMemberId
		});
		if (foundMember) {
			// If the member id already exists then remove from new member ids
			const filteredMemberIds = newMemberIds.filter((memberId) => {
                return memberId != newMemberId;
            });
			setNewMemberIds(filteredMemberIds);
		} else {
			// Add to the new members list
			setNewMemberIds((prev) => [...prev, newMemberId]);
		}
	}
	const handleAddNewMembers = async () => {
		// Add Members/Update chat
		try {
			await client
                .service("chats")
                .patch(ctx?.activeChat?._id, {
                    $push: { memberIds: { $each: newMemberIds } },
                });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(err:any) {
			ctx?.onNotif(`Updating name failed with error: ${err}`);
		} finally {
			ctx?.onNotif(`New members added successfully.`)
		}
	};

    useEffect(() => {
        client.service("chats").on("patched", (chat: Chat) => {
            ctx?.onSetActiveChat(chat);
        });
        return () => {
            client.service("chats").removeListener("patched");
        };
    }, []);

    // Search Forum Users
    type SearchMode = "ForumUserSearch" | "GlobalUserSearch";
    const [searchMode, setSearchMode] = useState<
        "ForumUserSearch" | "GlobalUserSearch"
    >("ForumUserSearch");
    const handleUpdateSearchMode = (searchMode: SearchMode) => {
        setSearchMode(searchMode);
    };
    const [searchQuery, setSearchQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeSearchQuery = (e: any) => {
        setSearchQuery(e.target.value);
    };
    const filteredUsers = useMemo(() => {
        // Do not filter if we are searching members to add to the forum
        if (searchMode == "GlobalUserSearch") return;
        return users.filter((user) => {
            if (user.username != undefined) {
                return user.username
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
            } else {
                return user.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
            }
        });
    }, [users, searchQuery]);
	const searchUsersGlobally = debounce(async (emailOrUsername) => {
		try {
			const response = await client.service("users").find({
				query: {
					$or: [
						{
							email: {
								$regex: emailOrUsername,
								$options: "im",
							},
						},
						{
							username: {
								$regex: emailOrUsername,
								$options: "im",
							},
						},
					],
					// $limit: 10,
				},
			});
			setUsers(response.data);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			ctx?.onNotif(`failed to search users with err: ${err}`);
		}
	}, 300);
	useEffect(() => {
		if (searchMode == "GlobalUserSearch" && searchQuery.trim() != "") {
			searchUsersGlobally(searchQuery);
		}
	}, [searchQuery]);

    const handleRemoveUser = async (memberId: string) => {
        console.log("🚀 ~ handleRemoveUser ~ memberId:", memberId)
        try {
            if (ctx?.activeChat?._id === 'undefined') throw Error('Missing active chat id');
            await client
                .service("chats")
                .patch(ctx?.activeChat?._id, {
                    $pull: { memberIds: memberId },
                });
            ctx?.onNotif(`Successfully removed user ${memberId}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`failed to search users with err: ${err}`);
        }
    }

    // Are you sure you want to exit the forum?
    enum ExitForumChoices {
        Yes = "Yes",
        No = "No",
        Maybe = "Maybe"
    }
    const [isExitForum, setIsExitForum] = useState(ExitForumChoices.No);
    const areYouSureYouWantToExitForum = async () => {
        setIsExitForum(ExitForumChoices.Maybe);
    };
    const exitForum = async () => {
        try {
            if (!ctx?.loggedInAs?._id) {
                await client.logout();
            }
            if (!ctx?.activeChat?._id) {
                throw Error('Active chat not set')
            }
            setIsExitForum(ExitForumChoices.Yes);
            await client.service("chats").patch(ctx!.activeChat!._id, {
                $pull: { memberIds: ctx!.loggedInAs!._id },
            });
            // Hide chat details modal
            ctx?.onToggleChatDetails();
            // Notify the sidebar that you have just left the forum
            // This allows the forum you have just left to be filtered
            ctx?.onSetIJustLeftThisForum(ctx!.activeChat!._id)
            // Reset active chat
            ctx?.onSetActiveChat(undefined);
            // Show notification
            ctx?.onNotif(`You left ${ctx?.activeChat?.name}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`failed to search users with err: ${err}`);
        }
    };

    const dontExitForum = () => {
        setIsExitForum(ExitForumChoices.No);
    }

    const closeModal = () => {
        ctx?.onToggleChatDetails();
    }

    // Allow members to send invite links for their friends to join the forum
    const copyInviteLink = () => {
        if (ctx?.activeChat?._id) {
            const inviteLink = `http://localhost:5173/${ctx!.activeChat!._id}`
            navigator.clipboard.writeText(inviteLink);
            ctx?.onNotif(`${inviteLink} copied to clipboard`);
        } else {
            ctx?.onNotif(`failed to copy invite link to clipboard`);
        }
    }

    return (
        <div className="w-full min-h-[75vh] bg-white rounded-t-3xl px-4 relative">
            <div className="w-full px-3 py-4 mt-4 flex flex-col gap-4 max-w-3xl mx-auto text-center lg:bg-gray-50">
                {isProcessing === "Name" ? (
                    <div className="w-[125px] h-[16px] bg-gray-300 animate-pulse inline-block">
                        &nbsp;
                    </div>
                ) : (
                    <>
                        {isEditChat == "Name" &&
                        ctx?.activeChat?.type === "group" ? (
                            <div className="flex max-w-md mx-auto relative">
                                <input
                                    type="text"
                                    className="border-b bg-transparent border-blue-200 outline-none text-center"
                                    value={name ?? ""}
                                    onChange={handleChangeName}
                                    onKeyDown={handleUpdateName}
                                    onBlur={handleInputBlur}
                                    placeholder="username"
                                />
                                <button
                                    className="px-2 text-gray-500 absolute -right-8 inset-y-0"
                                    onClick={() => handleEditChat(null)}
                                >
                                    <HighlightOffOutlinedIcon className="text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 justify-center mx-auto relative">
                                <h2
                                    className="text-2xl"
                                    onClick={() => handleEditChat("Name")}
                                >
                                    {ctx?.activeChat?.name}
                                </h2>
                                <button
                                    className="px-2 text-gray-500 absolute -right-8"
                                    onClick={() => handleEditChat("Name")}
                                >
                                    <EditOutlinedIcon fontSize="small" />
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
                            <div className="w-full relative max-w-xl">
                                <textarea
                                    className="border-b bg-transparent border-blue-200 outline-none w-full max-w-xl mx-auto text-center px-6"
                                    value={description ?? ""}
                                    onChange={handleChangeDescription}
                                    onKeyDown={handleUpdateDescription}
                                    onBlur={handleInputBlur}
                                    placeholder="description"
                                ></textarea>
                                <button
                                    className="px-2 text-gray-500 absolute -right-2 inset-y-0"
                                    onClick={() => handleEditChat(null)}
                                >
                                    <HighlightOffOutlinedIcon className="text-gray-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                {ctx?.activeChat?.description ? (
                                    <p
                                        onClick={() =>
                                            handleEditChat("Description")
                                        }
                                    >
                                        {ctx?.activeChat?.description}
                                    </p>
                                ) : (
                                    <p
                                        className="text-gray-400"
                                        onClick={() =>
                                            handleEditChat("Description")
                                        }
                                    >
                                        (empty description)
                                    </p>
                                )}
                                <button
                                    className="px-2 text-gray-500 absolute -right-2 -top-4 md:top-0 md:-right-8"
                                    onClick={() =>
                                        handleEditChat("Description")
                                    }
                                >
                                    <EditOutlinedIcon fontSize="small" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <p className="text-sm">
                    {ctx?.activeChat?.memberIds.length}&nbsp;members
                </p>
            </div>
            <div className="mx-auto w-full max-w-3xl my-8 py-2 border-gray-500 border-b flex justify-between">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleChangeSearchQuery}
                    className="bg-transparent outline-none w-full"
                    placeholder={`${
                        searchMode == "ForumUserSearch"
                            ? "search forum users"
                            : "search all users (add members)"
                    }`}
                />
                <button>
                    {searchMode == "ForumUserSearch" && (
                        <PersonSearchOutlinedIcon />
                    )}
                    {searchMode == "GlobalUserSearch" && (
                        <GroupAddOutlinedIcon />
                    )}
                </button>
            </div>
            <ul className="mx-auto w-full max-h-[50vh] overflow-y-auto max-w-3xl h-[50vh] relative mb-16">
                <li className="border border-gray-200 mb-2 hover:border-indigo-100">
                    <button
                        className={`flex items-center gap-8 h-10 p-2 w-full font-bold hover:bg-indigo-50 ${
                            searchMode == "GlobalUserSearch" && "bg-indigo-100"
                        }`}
                        onClick={handleToggleSearchMode}
                    >
                        <GroupAddOutlinedIcon className="m-1 text-indigo-600" />
                        Add members
                    </button>
                </li>
                <li className="border border-gray-200 mb-2 hover:border-indigo-100">
                    <button
                        className="flex items-center gap-8 h-10 p-2 w-full font-bold  hover:bg-indigo-50"
                        onClick={copyInviteLink}
                    >
                        <LinkOutlinedIcon className="m-1 text-indigo-600" />
                        Invite link
                    </button>
                </li>
                {filteredUsers ? (
                    <>
                        {filteredUsers.map((user: User) => (
                            <li key={user._id}>
                                <UserListItem
                                    user={user}
                                    loggedInUserId={ctx?.loggedInAs?._id}
                                    onShowUserProfile={() =>
                                        handleShowUserProfile(user._id)
                                    }
                                    onMessageUser={() =>
                                        handleMessageUser(user)
                                    }
                                    onRemoveUser={() =>
                                        handleRemoveUser(user._id)
                                    }
                                    showActions={true}
                                />
                            </li>
                        ))}
                    </>
                ) : (
                    <>
                        {/**Applies when the user does a global search for new members */}
                        {users.map((user: User) => (
                            <li
                                key={user._id}
                                onClick={() =>
                                    handleUpdateNewMemberIds(user._id)
                                }
                            >
                                <UserListItem
                                    user={user}
                                    loggedInUserId={ctx?.loggedInAs?._id}
                                    onShowUserProfile={() =>
                                        handleShowUserProfile(user._id)
                                    }
                                    onMessageUser={() =>
                                        handleMessageUser(user)
                                    }
                                    isSelected={
                                        newMemberIds.indexOf(user._id) > -1
                                            ? true
                                            : false
                                    }
                                />
                            </li>
                        ))}
                        {searchMode && (
                            <div className="flex justify-end gap-2 py-2">
                                <button
                                    className="py-1 px-3 border border-indigo-500 text-indigo-600 font-bold rounded-sm hover:bg-indigo-100"
                                    onClick={() =>
                                        handleUpdateSearchMode(
                                            "ForumUserSearch"
                                        )
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    className="py-1 px-3 bg-indigo-500 text-white font-bold rounded-sm hover:bg-indigo-700"
                                    onClick={handleAddNewMembers}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </>
                )}
                <li className="sticky bottom-0 w-full border hover:border-red-100">
                    {isExitForum == ExitForumChoices.No && (
                        <button
                            className="flex gap-8 items-center h-10 p-2 w-full font-bold text-red-600 hover:bg-red-50"
                            onClick={areYouSureYouWantToExitForum}
                        >
                            <ExitToAppOutlinedIcon />
                            Exit group
                        </button>
                    )}
                    {isExitForum == ExitForumChoices.Maybe && (
                        <div className="flex gap-4 items-center px-2 h-10 justify-between bg-red-50">
                            <span className="flex items-center gap-8">
                                <SentimentDissatisfiedOutlinedIcon />
                                Are you sure?
                            </span>

                            <div className="flex gap-8 text-sm">
                                <button
                                    className="px-6 font-bold text-indigo-600 underline hover:bg-indigo-50"
                                    onClick={dontExitForum}
                                >
                                    No
                                    <span className="hidden md:inline">
                                        , I want to stay
                                    </span>
                                </button>
                                <button
                                    className="px-6 font-bold text-red-600 underline hover:bg-red-50"
                                    onClick={exitForum}
                                >
                                    Yes
                                    <span className="hidden md:inline">
                                        , I want to leave
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            </ul>
            <div className="absolute inset-x-0 bottom-0">
                <button
                    className="text-sm mx-auto px-3 h-10 border rounded-sm flex items-center gap-2 mb-8 font-bold hover:bg-gray-100"
                    onClick={closeModal}
                >
                    <HighlightOffOutlinedIcon fontSize="small" />
                    Close
                </button>
            </div>
        </div>
    );
};

export default ChatDetails;
