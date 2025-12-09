import { IUserType } from "./user.type";

export enum FriendStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected"
}
export interface IFriendType {
    id: string;
    sender:IUserType,
    receiver: IUserType,
    status: FriendStatus,
    created_At: Date,
    isOnline: boolean,
    lastSeen: Date
}

export interface IDataFriendType extends Pick< IFriendType, "id" | "status" |"isOnline"|"lastSeen">{
    user: IUserType
}

export interface IDataFriendReqType extends Pick< IFriendType, "id" | "status">{
    user: IUserType
}