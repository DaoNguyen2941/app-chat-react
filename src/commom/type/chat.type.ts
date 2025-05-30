import { IUserType } from "./user.type";

export enum enumInvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export interface IChatGroupInfo {
    id: string;
    members: IUserType[];
    name: string | null;
    manager: IUserType
}
export interface IPendingInvitationGroup {
    id: string;
    status: enumInvitationStatus,
    invitedBy: IUserType,
    chatGroup: IChatGroupInfo
    expiredAt: string | Date | null;
}

export interface IChat {
    id: string;
    user: IUserType;
    unreadCount: number;
    status: 'online' | 'offline';
    lastSeen: Date | null
    IsGroup: boolean,
    chatGroup: IChatGroupInfo
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
    members: IUserType[];
    name: string | null;
}

