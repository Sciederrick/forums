import { useContext, useEffect, useState } from "react";
// import { formatChatTimestamp } from "../utils";
import { AppContext } from "../contexts/AppContext";
import { User } from "../types";
import client from "../lib/feathersClient";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";

const ContactDetails = () => {
    const ctx = useContext(AppContext);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!ctx?.userDetailsUserId) return;
                const profile = await client
                    .service("users")
                    .find({ query: { _id: ctx?.userDetailsUserId } });
                console.log(
                    "🚀 ~ fetchUsers ~ ctx?.userDetailsUserId:",
                    ctx?.userDetailsUserId
                );
                console.log("🚀 ~ fetchUsers ~ profile:", profile);
                setUser(profile.data[0]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                ctx?.onNotif(`Fetching user failed with err: ${err}`);
            }
        };
        fetchUsers();
    }, [ctx?.userDetailsUserId]);

    return (
        <div className="lg:w-[540px]">
            <div className="relative w-full rounded px-3 py-4 flex flex-col gap-4 bg-gray-50 mt-8 pt-10">
                <div className=" absolute -top-8 z-10 bg-white rounded-full">
                    <img
                        src={user?.avatar}
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                </div>
                <p className="text-sm text-lg">{user?.email}</p>
            </div>
            {ctx?.loggedInAs?._id != user?._id && (
                <>
                    <div className="mx-auto h-[2px] my-8 bg-gray-100 w-full">
                        &nbsp;
                    </div>
                    <div className="flex flex-col items-start gap-6">
                        <button className="font-semibold">
                            <MailOutlineOutlinedIcon />
                            &nbsp; Direct Message
                        </button>
                        <button
                            className="font-semibold text-red-600 hover:text-red-800"
                            title="coming soon"
                            disabled
                        >
                            <BlockOutlinedIcon />
                            &nbsp; Block
                        </button>
                        <button
                            className="font-semibold text-red-600 hover:text-red-800"
                            title="coming soon"
                            disabled
                        >
                            <ReportOutlinedIcon />
                            &nbsp; Report
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ContactDetails;
