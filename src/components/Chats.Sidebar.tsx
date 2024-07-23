import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import client from "../lib/feathersClient";
import { AppContext } from "../contexts/AppContext";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Chat } from "../types";
import { Toolbar } from "@mui/material";
import MyToolbar from "./Toolbar.Sidebar";

const ChatProfiles = () => {
    const ctx = useContext(AppContext);
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Get chats where the logged in user is part of
                const chats = await client.service("chats").find();
                setChats(chats.data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching chats failed with err: ${err}`);
            }
        };
        fetchChats();

        const handleNewChat = (newChat: Chat) => {
            const loggedInUserId = ctx?.loggedInAs?._id;
            if (!loggedInUserId) return;
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

    return (
        <>
            <Toolbar>
                <MyToolbar />
            </Toolbar>
            <Divider />
            <ul>
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className="flex items-center gap-2 p-4 text-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => handleClickOpenChat(chat)}
                    >
                        <ForumOutlinedIcon className="text-gray-400" />
                        <p>{chat.name}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChatProfiles;
