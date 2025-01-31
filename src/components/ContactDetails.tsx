import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { User } from "../types";
import client from "../lib/feathersClient";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import useMessageUser from "../hooks/useMessageUser";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const ContactDetails = () => {
    const ctx = useContext(AppContext);
    const [user, setUser] = useState<User | null>(null);
    const { messageUser } = useMessageUser(ctx);
    const handleMessageUser = () => {
        if (user) {
            messageUser(user);
            // Dismiss the user details modal
            ctx?.onSetUserDetailsUserId(null);
        } else {
            // The user is not set
            ctx?.onNotif("Something went wrong");
        }
    };
    const handleUpdatedUser = (user: User) => {
        setUser(user);
    };

    // Edit Mode For the Current User's Profile
    // Allows the current user to edit their username & description
    type Edit = "Username" | "Description";
    const [isEditProfile, setIsEditProfile] = useState<Edit | null>(null);
    const handleSetEditProfile = (el: Edit) => {
        if (isEditProfile === el) {
            // Turn off edit mode
            setIsEditProfile(null);
        } else {
            setIsEditProfile(el);
        }
    };
    const [username, setUsername] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeUsername = (e: any) => {
        setUsername(e.target.value);
    };
    const [bio, setBio] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeDescription = (e: any) => {
        setBio(e.target.value);
    };
    type Process = "Username" | "Description";
    const [isProcessing, setIsProcessing] = useState<Process | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateUsername = async (e: any) => {
        try {
            if (e.key === "Enter") {
                e.currentTarget.blur();
                setIsProcessing("Username");
                await client
                    .service("users")
                    .patch(ctx?.loggedInAs?._id, { username });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Updating the username failed with error: ${err}`);
        } finally {
            setIsProcessing(null);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdateDescription = async (e: any) => {
        try {
            if (e.key === "Enter") {
                e.currentTarget.blur();
                setIsProcessing("Description");
                await client
                    .service("users")
                    .patch(ctx?.loggedInAs?._id, { bio });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Updating the description failed with error: ${err}`);
        } finally {
            setIsProcessing(null);
        }
    };
    // Switch of edit mode on input blur
    const handleInputBlur = () => {
        setIsEditProfile(null);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!ctx?.userDetailsUserId) return;
                const profile = await client
                    .service("users")
                    .find({ query: { _id: ctx?.userDetailsUserId } });
                setUser(profile.data[0]);
                if (user?.username) setUsername(user.username);
                if (user?.bio) setBio(user.bio);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching user failed with err: ${err}`);
            }
        };
        fetchUsers();

        // Track user profile updates
        client.service("users").on("patched", handleUpdatedUser);

        return () => {
            client.service("users").removeListener("patched");
        };
    }, [ctx?.userDetailsUserId]);

    return (
        <div className="w-full">
            <div className={`relative rounded-t-3xl px-3 py-4 flex flex-col gap-4 bg-gray-50 mt-8 pt-10 px-8 w-full ${ctx?.loggedInAs?._id != user?._id ? 'min-h-[200px]' : 'min-h-[400px]'}`}>
                <div className="absolute -top-8 left-[48vw] z-10 bg-gray-50 rounded-full">
                    <img
                        src={user?.avatar}
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                </div>
                <div className="text-sm flex items-center justify-center text-center font-bold">
                    {user?.email}&nbsp;·&nbsp;
                    {!isEditProfile && user?.username}
                    {!user?.username &&
                        ctx?.loggedInAs?._id == user?._id &&
                        isEditProfile != "Username" &&
                        isProcessing != "Username" &&
                        "[add username]"}
                    {isProcessing === "Username" ? (
                        <div className="w-[125px] h-[16px] bg-gray-300 animate-pulse inline-block">
                            &nbsp;
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                className={`${
                                    isEditProfile != "Username" && "hidden"
                                } border-b bg-transparent border-blue-200 outline-none`}
                                value={username}
                                onChange={handleChangeUsername}
                                onKeyDown={handleUpdateUsername}
                                onBlur={handleInputBlur}
                                placeholder="username"
                            />
                            {ctx?.loggedInAs?._id == user?._id && (
                                <button
                                    className="inline px-2 text-gray-500"
                                    onClick={() =>
                                        handleSetEditProfile("Username")
                                    }
                                >
                                    {isEditProfile != "Username" &&
                                    ctx?.loggedInAs?._id == user?._id ? (
                                        <EditOutlinedIcon />
                                    ) : (
                                        <HighlightOffOutlinedIcon />
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className="text-sm flex items-center justify-center text-center w-full max-w-xl mx-auto">
                    {isEditProfile != "Description" && user?.bio}
                    {!user?.bio &&
                        ctx?.loggedInAs?._id == user?._id &&
                        isEditProfile != "Description" &&
                        isProcessing != "Description" &&
                        "[add bio]"}
                    {isProcessing === "Description" ? (
                        <div className="flex flex-col gap-1">
                            <div className="w-[250px] h-[16px] bg-gray-300 animate-pulse inline-block">
                                &nbsp;
                            </div>
                            <div className="w-[175px] h-[16px] bg-gray-300 animate-pulse inline-block">
                                &nbsp;
                            </div>
                        </div>
                    ) : (
                        <>
                            <textarea
                                className={`${
                                    isEditProfile != "Description" && "hidden"
                                } border-b bg-transparent border-blue-200 outline-none w-full max-w-xl mx-auto text-center`}
                                value={bio}
                                onChange={handleChangeDescription}
                                onKeyDown={handleUpdateDescription}
                                onBlur={handleInputBlur}
                                placeholder="description"
                            ></textarea>
                            {ctx?.loggedInAs?._id == user?._id && (
                                <button
                                    className="inline px-2 text-gray-500"
                                    onClick={() =>
                                        handleSetEditProfile("Description")
                                    }
                                >
                                    {isEditProfile != "Description" ? (
                                        <EditOutlinedIcon />
                                    ) : (
                                        <HighlightOffOutlinedIcon />
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {ctx?.loggedInAs?._id != user?._id && (
                <div className="bg-gray-50">
                    <div className="mx-auto h-[2px] bg-gray-100 w-full max-w-3xl">
                        &nbsp;
                    </div>
                    <div className="flex flex-col items-start gap-6 w-full max-w-3xl mx-auto py-16">
                        <button
                            className="mx-auto font-semibold"
                            onClick={handleMessageUser}
                        >
                            <MailOutlineOutlinedIcon />
                            &nbsp; Message
                        </button>
                        <button
                            className="mx-auto font-semibold text-red-600 hover:text-red-800"
                            title="coming soon"
                            disabled
                        >
                            <BlockOutlinedIcon />
                            &nbsp; Block
                        </button>
                        <button
                            className="mx-auto font-semibold text-red-600 hover:text-red-800"
                            title="coming soon"
                            disabled
                        >
                            <ReportOutlinedIcon />
                            &nbsp; Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactDetails;
