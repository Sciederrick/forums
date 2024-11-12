export interface Config {
    environment: "production" | "development";
    production: {
        REACT_APP_API_BASE_URL: string;
    },
    development: {
        REACT_APP_API_BASE_URL: string;
    }
}

export interface User {
    _id: string;
    email: string;
    avatar: string;
    username?: string;
    bio?: string;
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