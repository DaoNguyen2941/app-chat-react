import { FriendStatus } from "./friend.type";
export type GenderType = 'Male' | 'Female' | 'Other';

export interface IUser {
    id: string;
    email: string;
    avatar: string;
    name: string;
    account: string;
}


export interface IFriendStatus {
    id: string;
    senderId: string;
    status: FriendStatus;
}

export interface IUserType extends Pick<IUser, "id" | "avatar" | 'name'>  {}

export interface ISearchUser extends Pick<IUser, "id" | "avatar" | "name"> {
    statusFriend: IFriendStatus | null;
}
