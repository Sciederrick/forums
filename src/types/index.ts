export interface User {
    _id: string;
    email: string;
    avatar: string;
    username?: string;
    description?: string;
}

export interface Chat {
    _id: string;
    name: string;
    type: "group" | "dm";
    description?: string;
    memberIds: string[];
    dmRecipients?: User[];
    createdAt: number;
}

export enum ActiveSidebarComponent {
    newForum = "newForum",
    groupChat = "groupChat"
}