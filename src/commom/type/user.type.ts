import { FriendStatus } from "./friend.type";

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

export interface IUserType extends Pick<IUser, "id" | "account" | "avatar" | 'name'>  {}

export interface ISearchUser extends Pick<IUser, "id" | "avatar" | "account" | "name"> {
    statusFriend: IFriendStatus | null;
}
