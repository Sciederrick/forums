import Divider from "@mui/material/Divider";
import { useContext, useEffect, useState } from "react";
import client from "../lib/feathersClient";
import { AppContext } from "../contexts/AppContext";
import { User } from "../types";

const ChatProfiles = () => {
    const ctx = useContext(AppContext);
    const [profiles, setProfiles] = useState<User[]>([]);
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const profiles = await client.service("users").find();
                setProfiles(profiles.data);
                console.log("🚀 ~ fetchProfiles ~ profiles:", profiles);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching profiles failed with err: ${err}`);
            }
        };
        fetchProfiles();

        client.service("users").on("created", (newProfile: User) => {
            setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
        });
    }, []);

    return (
        <>
            <Divider />
            <ul>
                {profiles.map((profile) => (
                    <li
                        key={profile._id}
                        className="flex items-center gap-2 p-2 text-sm"
                    >
                        <img
                            src={profile.avatar}
                            height={32}
                            width={32}
                            className="rounded-full"
                        />
                        <p>{profile.email}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChatProfiles;
