export interface User {
    _id: string;
    email: string;
    avatar: string;
}

export interface Chat {
    _id: string;
    name: string;
    type: "group" | "dm";
    memberIds: string[];
    createdAt: number;
}