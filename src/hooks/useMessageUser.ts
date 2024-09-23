// hooks/useMessageUser.js
import { useCallback } from "react";
import client from "./../lib/feathersClient"; // Adjust the import based on your project structure
import { User } from "../types";
import { TypeAppContext } from "../contexts/AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useMessageUser = (ctx: TypeAppContext | undefined) => {
    const messageUser = useCallback(
        async (user: User) => {
            console.log("🚀 ~ user:", user)
            if (!user?._id) {
                ctx?.onNotif(`User ID is required to message`);
                return;
            }

            try {
                // #1. Look for existing chat with the user, `findChat`
                const existingChat = await client.service("chats").find({
                    query: { type: "dm", memberIds: { $in: [user._id] } },
                });
                console.log("🚀 ~ existingChat ~ existingChat:", existingChat)

                // #2. If non-existent, create one
                let newChat = null;
                console.log("🚀 ~ newChat:", newChat)
                if (existingChat.total === 0) {
                    newChat = await client.service("chats").create({
                        type: "dm",
                        memberIds: [ctx?.loggedInAs?._id, user._id],
                    });
                }

                // #3. Otherwise, setActiveChat using the result of `findChat`
                ctx?.onSetActiveChat(
                    existingChat.total > 0 ? existingChat.data[0] : newChat
                );
            } catch (error) {
                ctx?.onNotif(`Failed fetching messages with err: ${error}`);
            }
        },
        [ctx]
    );

    return { messageUser };
};

export default useMessageUser;
