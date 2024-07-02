import { useEffect, useState } from "react";
import client from "../lib/feathersClient";
import { User } from "../types";

interface Msg {
    _id: string,
    text: string,
    userId: string,
    createdAt: number,
    user: User,
}
const Chat = () => {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    useEffect(() => {
        const fetchMsgs = async () => {
            const msgs = await client
                .service("messages")
                .find({ query: { $sort: { createdAt: -1 }, $limit: 25 } });
            console.log("🚀 ~ fetchMsgs ~ msgs:", msgs)
            setMsgs(msgs.data.reverse());
        };
        fetchMsgs();
    }, []);

    return (
        <>
            <ul>
                {msgs.map((msg) => (
                    <li key={msg._id} className="flex items-center gap-4 pb-4 text-sm">
                        <img src={msg.user.avatar} width={32} height={32}className="rounded-full"/>
                        <div className="flex flex-col ">
                            <p>{msg.user.email}</p>
                            <p>
                                {msg.text}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Chat;
