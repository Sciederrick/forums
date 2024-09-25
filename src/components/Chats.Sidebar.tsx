import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import client from "../lib/feathersClient";
import { AppContext } from "../contexts/AppContext";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Chat, User } from "../types";
import { Toolbar } from "@mui/material";
import MyToolbar from "./Toolbar.Sidebar";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const ChatProfiles = () => {
    const ctx = useContext(AppContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const [isDirectMessages, setIsDirectMessages] = useState(false);
    const fetchChats = async (chatCategory: "dm" | "group") => {
        try {
            // Get chats where the logged in user is part of
            const chats = await client.service("chats").find({
                query: { type: chatCategory },
            });
            setChats(chats.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            ctx?.onNotif(`Fetching chats failed with err: ${err}`);
        }
    };

    const handletoggleDirectMessages = () => {
        setIsDirectMessages((prev) => !prev);
        ctx?.onSetActiveChat(undefined);
    };

    const [isFirstRun, setIsFirstRun] = useState(true);
    useEffect(() => {
        if (!isFirstRun) {
            const newChatCategory = isDirectMessages ? "dm" : "group";
            fetchChats(newChatCategory);
        } else {
            setIsFirstRun(false);
        }
    }, [isDirectMessages]);

    useEffect(() => {
        if (ctx?.activeChat?.type) {
            setIsDirectMessages(ctx.activeChat.type == "dm");
        }
    }, [ctx?.activeChat]);

    useEffect(() => {
        fetchChats("group");
        const handleNewChat = (newChat: Chat) => {
            const loggedInUserId = ctx?.loggedInAs?._id;
            if (!loggedInUserId) return;
            if (
                (newChat.type == "dm" && !isDirectMessages) ||
                (newChat.type == "group" && isDirectMessages)
            ) {
                return; // only update if the updated category(DM or Group chat) is visible
            }
            if (newChat.memberIds.indexOf(loggedInUserId) > -1) {
                setChats((prevChats) => [...prevChats, newChat]);
            }
        };

        client.service("chats").on("created", handleNewChat);

        return () => {
            client.service("chats").off(handleNewChat);
        };
    }, []);

    const handleClickOpenChat = (chat: Chat) => {
        // hide group details
        if (ctx?.showGroupDetails) ctx?.onToggleGroupDetails();
        // switch/open chat
        ctx?.onSetActiveChat(chat);
    };

    // Because DM chat response returns the current user and the recipient as an array
    const filterRecipient = (recipients: User[]): User => {
        const out = recipients.filter((recipient) => {
            return recipient._id != ctx?.loggedInAs?._id;
        });
        return out[0];
    };
    const displayRecipientNameOrEmail = (recipients: User[] | undefined) => {
        return recipients ? filterRecipient(recipients).email : "";
    };

    return (
        <div className="relative h-full">
            <Toolbar>
                <MyToolbar />
            </Toolbar>
            <Divider />
            <ul className="flex flex-col gap-[1.5px]">
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className={`flex items-center gap-2 p-4 text-sm cursor-pointer hover:bg-gray-100 ${
                            ctx?.activeChat?._id == chat._id
                                ? "bg-gray-100"
                                : ""
                        }`}
                        onClick={() => handleClickOpenChat(chat)}
                    >
                        <ForumOutlinedIcon className="text-gray-400" />
                        <p>
                            {chat.name ??
                                displayRecipientNameOrEmail(chat.dmRecipients)}
                        </p>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-2 absolute bottom-0 py-4 bg-white border-t w-full justify-center bg-gray-200">
                <FormControlLabel
                    value="group"
                    control={
                        <Switch
                            color="primary"
                            checked={isDirectMessages}
                            onChange={handletoggleDirectMessages}
                        />
                    }
                    label="Groups"
                    labelPlacement="start"
                />
                <span>DMs</span>
            </div>
        </div>
    );
};

export default ChatProfiles;
