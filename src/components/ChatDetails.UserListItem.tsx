import { User } from "../types";

import Actions from "./Actions.ChatDetails.UserListItem";

type Props = {
    user: User;
    loggedInUserId: string | undefined;
    onShowUserProfile: (userId: string) => void;
    onMessageUser: (user: User) => void;
    isSelected?: boolean;
    onRemoveUser?: (user: User) => void;
    showActions?: boolean; // For showing actions that run against existing forum members, so its off for global search for new members.
};

const UserListItem = ({
    user,
    loggedInUserId,
    onShowUserProfile,
    onMessageUser,
    isSelected,
    onRemoveUser = () => {},
    showActions = false
}: Props) => {
    return (
        <div
            className={`flex items-center justify-between p-2 text-sm my-2 bg-gray-50 rounded hover:bg-indigo-50 ${
                isSelected && "bg-green-200 hover:bg-green-200"
            }`}
        >
            <div className="flex items-center gap-8">
                <img
                    src={user.avatar}
                    height={32}
                    width={32}
                    className="rounded-full cursor-pointer"
                    onClick={() => onShowUserProfile(user._id)}
                />
                {loggedInUserId === user._id ? (
                    <p>You</p>
                ) : (
                    <p>
                        {typeof user.username === "string" &&
                        user.username.trim().length > 0
                            ? user.username
                            : user.email}
                    </p>
                )}
            </div>
            {showActions && loggedInUserId !== user._id && (
                <Actions
                    user={user}
                    onMessageUser={() => onMessageUser(user)}
                    onRemoveUser={() => onRemoveUser(user)}
                />
            )}
        </div>
    );
};

export default UserListItem;
