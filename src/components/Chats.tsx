import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import client from "../lib/feathersClient";
import { AppContext } from "../contexts/AppContext";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

interface Chat {
    _id: string;
    name: string;
    type: "group"|"dm";
    memberIds: string[];
    createdAt: number;
}

const ChatProfiles = () => {
    const ctx = useContext(AppContext);
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Get chats where the logged in user is part of
                const chats = await client.service("chats").find();
                console.log("🚀 ~ fetchChats ~ chats:", chats);
                console.log(
                    "🚀 ~ fetchChats ~ ctx?.loggedInAs?._id:",
                    ctx?.loggedInAs?._id
                );
                setChats(chats.data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching chats failed with err: ${err}`);
            }
        };
        fetchChats();

        client.service("chats").on("created", (newProfile: User) => {
            setChats((prevProfiles) => [...prevProfiles, newProfile]);
        });
    }, []);

    return (
        <>
            <Divider />
            <ul>
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className="flex items-center gap-2 p-4 text-sm"
                    >
                        <ForumOutlinedIcon className="text-gray-400"/>
                        <p>{chat.name}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChatProfiles;
