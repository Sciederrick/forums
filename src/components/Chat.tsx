/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import client from "../lib/feathersClient";
import { User } from "../types";
import { formatChatTimestamp } from "../utils";

interface Msg {
    _id: string;
    text: string;
    userId: string;
    createdAt: number;
    user: User;
}
const Chat = () => {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    useEffect(() => {
        const fetchMsgs = async () => {
            const msgs = await client
                .service("messages")
                .find({ query: { $sort: { createdAt: -1 }, $limit: 25 } });
            setMsgs(msgs.data.reverse());
            setTimeout(scrollToBottom, 0);
        };
        fetchMsgs();

        client.service("messages").on("created", (newMsg: Msg) => {
            setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
            setTimeout(scrollToBottom, 0);
        });
    }, []);

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

    return (
        <>
            <ul className="h-[83vh] overflow-y-scroll pb-16 mb-4">
                {msgs.map((msg) => (
                    <li key={msg._id} className="flex items-center gap-4 pb-4">
                        <img
                            src={msg.user.avatar}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div className="flex flex-col max-w-xl">
                            <p className="text-xs text-gray-400">{msg.user.email}</p>
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
                    Submit
                </button>
            </div>
        </>
    );
};

export default Chat;
