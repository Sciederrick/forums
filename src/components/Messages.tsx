/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";
import client from "../lib/feathersClient";
import { User } from "../types";
import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import ForumsLogoBlack from "/forums-high-resolution-logo-transparent.svg";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

interface Msg {
    _id: string;
    text: string;
    userId: string;
    chatId: string;
    createdAt: number;
    user: User;
}
const Messages = () => {
    const ctx = useContext(AppContext);
    const [msgs, setMsgs] = useState<Msg[]>([]);
    useEffect(() => {
        const fetchMsgs = async () => {
            const msgs = await client.service("messages").find({
                query: {
                    chatId: ctx?.activeChat,
                    $sort: { createdAt: -1 },
                    $limit: 25,
                },
            });
            setMsgs(msgs.data.reverse());
            setTimeout(scrollToBottom, 0);
        };
        if (ctx?.activeChat) fetchMsgs();

        const handleNewMessage = (newMsg: Msg) => {
            if (newMsg.chatId === ctx?.activeChat?._id) {
                setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
                setTimeout(scrollToBottom, 0);
            }
        };

        client.service("messages").on("created", handleNewMessage);

        // Cleanup event listener on component unmount or when activeChatId changes
        return () => {
            client.service("messages").off("created", handleNewMessage);
        };
    }, [ctx?.activeChat]);

    const [inputMsg, setInputMsg] = useState("");
    const handleMsgInput = (e: any) => {
        setInputMsg(e.target.value);
    };

    const handleSendMsg = async (e: any) => {
        e.preventDefault();

        await client.service("messages").create({ text: inputMsg });

        setInputMsg("");
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            handleSendMsg(e);
        }
    };

    const bottomRef = useRef(null);
    const scrollToBottom = () => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const activeChatCanvas = (
        <>
            <ul className="h-[75vh] overflow-y-scroll pb-16 mb-4 md:h-[80vh]">
                {msgs.map((msg) => (
                    <li key={msg._id} className="flex items-center gap-4 pb-4">
                        <img
                            src={msg.user.avatar}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div className="flex flex-col max-w-xl">
                            <p className="text-xs text-gray-400">
                                {msg.user.email}
                            </p>
                            <p className="text-sm py-1">{msg.text}</p>
                            <p className="text-xs text-gray-400">
                                {formatChatTimestamp(msg.createdAt)}
                            </p>
                        </div>
                    </li>
                ))}
                <li ref={bottomRef}></li>
            </ul>
            <div className="h-12 border rounded flex overflow-hidden">
                <input
                    type="text"
                    name="msg-input"
                    id="msg-input"
                    className="border w-full"
                    value={inputMsg}
                    onChange={handleMsgInput}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="submit"
                    className="px-3 py-2 bg-gray-500 text-white font-bold hover:bg-gray-700"
                    onClick={handleSendMsg}
                >
                    <span className="md:hidden">
                        <SendOutlinedIcon />
                    </span>
                    <span className="hidden md:inline">Submit</span>
                </button>
            </div>
        </>
    );

    const inactiveChatCanvas = (
        <div className="h-[85vh] w-full flex flex-col gap-8 justify-center items-center">
            <img
                src={ForumsLogoBlack}
                height={150}
                width={150}
                alt="Forums Logo"
            />
            <p className="text-gray-500 text-center text-xs">
                Building Communities, <br /> One Chat at a Time
            </p>
        </div>
    );

    return ctx?.activeChat ? activeChatCanvas : inactiveChatCanvas;
};

export default Messages;
