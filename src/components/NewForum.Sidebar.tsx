import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import client from "../lib/feathersClient";
import { ActiveSidebarComponent, User } from "../types";
import { AppContext } from "../contexts/AppContext";
import { Divider } from "@mui/material";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

const NewGroup = () => {
    const ctx = useContext(AppContext);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeSearch = (e: any) => {
        const value = e.target.value;
        setSearchTerm(value);
    };
    const handleToggleSearch = () => {
        setShowSearch((prevState) => !prevState);
    };
    const handleClickbtnBack = () => {
        if (!showSearch) {
            // Show group chats
            ctx?.onSetActiveSidebarComponent(ActiveSidebarComponent.groupChat);
        } else {
            // show all users TODO: show only friends
            setSearchTerm(""); // reset
            setShowSearch((prevState) => !prevState);
        }
    };

    const [users, setUsers] = useState<User[]>([]);
    const searchUsers = debounce(async (email) => {
        try {
            if (email) {
                const response = await client.service("users").find({
                    query: {
                        email: { $regex: email, $options: "im" },
                        // $limit: 10,
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
            if (ctx?.loggedInAs?._id) {
                const response = await client.service("users").find({
                    query: {
                        _id: {
                            $ne: ctx.loggedInAs._id, // Exclude myself (logged in user)
                        },
                    },
                });
                setUsers(response.data);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`failed to fetch users with err: ${err}`);
        }
    };

    const [isAlreadyExecuted, setIsAlreadyExecuted] = useState(false);
    useEffect(() => {
        // Get all users on mounted
        if (!isAlreadyExecuted) {
            // Add logged in user as the first member of the group
            if (ctx?.loggedInAs?._id) {
                setMemberIds([ctx?.loggedInAs?._id])
            }
            getAllUsers();
            setIsAlreadyExecuted(true);
        } else {
            // Search users on search
            if (searchTerm.trim() == "") {
                getAllUsers();
            } else {
                searchUsers(searchTerm);
            }
        }
    }, [searchTerm]);

    const [memberIds, setMemberIds] = useState<string[]>([]); // members to add to the group
    const handleClickToggleSelectMember = (id: string) => {
        if (memberIds.indexOf(id) == -1) {
            setMemberIds((prevIds) => [...prevIds, id]);
        } else {
            // deselect
            setMemberIds((prevIds) => [
                ...prevIds.filter((prevId) => prevId != id),
            ]);
        }
    };

    enum CurrentComponent {
        forumMembers = "forumMembers",
        forumDescription = "forumDescription",
    }
    const [activeComponent, setActiveComponent] = useState(
        CurrentComponent.forumMembers
    );
    // Toggle between forum description and forum members component
    const handleClickBtnNavigate = (component: CurrentComponent) => {
        setActiveComponent(component);
    };

    // Forum Members Component
    const members = (
        <div className="relative h-full">
            <div className="flex justify-between gap-2 px-3 py-4 sticky">
                <div className="flex items-center gap-4">
                    <button onClick={handleClickbtnBack}>
                        <ArrowBackIosOutlinedIcon />
                    </button>
                    {showSearch ? (
                        <input
                            onChange={handleChangeSearch}
                            id="search"
                            name="search"
                            autoComplete="true"
                            placeholder="type to search ..."
                            className="w-full h-[32px] focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <div className="h-[32px] flex flex-col justify-center pl-3 text-ellipsis">
                            <h2>New Forum</h2>
                            <h3 className="text-sm text-gray-400">
                                Add members&nbsp;({memberIds.length})
                            </h3>
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
            <ul className="flex flex-col gap-[1.5px] max-h-[75vh] overflow-y-auto">
                {users.map((user) => (
                    <li
                        key={user._id}
                        className={`flex items-center gap-2 p-4 text-sm cursor-pointer hover:bg-gray-100 ${
                            memberIds.indexOf(user._id) > -1
                                ? "bg-green-100"
                                : ""
                        }`}
                        onClick={() => handleClickToggleSelectMember(user._id)}
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
            <button
                className="bg-green-600 text-white absolute bottom-6 right-6 p-2 rounded-xl shadow-lg hover:bg-green-800 md:bottom-16"
                onClick={() =>
                    handleClickBtnNavigate(CurrentComponent.forumDescription)
                }
            >
                <ArrowForwardIosOutlinedIcon />
            </button>
        </div>
    );

    const [forumName, setForumName] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeForumName = (e: any) => {
        const value = e.target.value;
        setForumName(value);
    };
    const [forumDescription, setForumDescription] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeForumDescription = (e: any) => {
        const value = e.target.value;
        setForumDescription(value);
    };

    // Create forum
    const handleClickBtnSubmit = async () => {
        try {
            const response = await client
                .service("chats")
                .create({
                    name: forumName,
                    type: "group",
                    description: forumDescription,
                    memberIds: memberIds,
                });
                ctx?.onNotif(`Group ${response.name} created succesfully!`);
                ctx?.onSetActiveChat(response);
                ctx?.onSetActiveSidebarComponent(ActiveSidebarComponent.groupChat);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Creating chat failed with error: ${err}`)
        }
    };

    // Forum Description Component
    const description = (
        <div className="relative h-full">
            <div className="px-3 flex gap-2">
                <button
                    onClick={() =>
                        handleClickBtnNavigate(CurrentComponent.forumMembers)
                    }
                >
                    <ArrowBackIosOutlinedIcon />
                </button>
                <div className="h-[64px] flex flex-col justify-center p-3 gap-1">
                    <h2>New Forum</h2>
                    <input
                        onChange={handleChangeForumName}
                        id="forumName"
                        name="forumName"
                        autoComplete="true"
                        placeholder="Type forum name ..."
                        className="w-full h-[32px] focus:outline-none"
                        autoFocus
                    />
                </div>
            </div>
            <Divider />
            <textarea
                name="groupDescription"
                id="groupDescription"
                rows={2}
                placeholder="Add description ..."
                className="py-4 px-3 mt-2 w-full focus:outline-none"
                onChange={handleChangeForumDescription}
            />
            <button
                className="bg-green-600 text-white absolute bottom-6 right-6 p-2 rounded-xl shadow-lg hover:bg-green-800 md:bottom-16"
                onClick={handleClickBtnSubmit}
            >
                <DoneOutlinedIcon />
            </button>
        </div>
    );

    // render
    return (
        <>
            {activeComponent == CurrentComponent.forumDescription
                ? description
                : members}
        </>
    );
};

export default NewGroup;
