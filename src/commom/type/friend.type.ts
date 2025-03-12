import { IUserType } from "./user.type";

export enum FriendStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected" // (nếu cần thêm trạng thái)
}
export interface IFriendType {
    id: string;
    sender:IUserType,
    receiver: IUserType,
    status: FriendStatus,
    created_At: Date,
}

export interface IDataFriendType extends Pick< IFriendType, "id" | "status">{
    user: IUserType
}