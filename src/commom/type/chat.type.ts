import { IUserType } from "./user.type";

export interface IChat {
    id: string;
    user:IUserType;
    unreadCount: number;
    status: 'online' | 'offline';
    lastSeen: Date | null
    IsGroup:boolean,
    chatGroup: {
        members: {avatar: string}[],
        name: string
    }
}

export interface Imessage {
    id: string;
    author: IUserType;
    content: string;
    created_At: Date;
}

export interface IChatData {
    id: string;
    user: IUserType | null;
    message: Imessage[];
    isGroup: boolean;
    members: IUserType[] | null;
    name: string | null;

}