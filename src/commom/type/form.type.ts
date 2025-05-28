import { IUser } from "./user.type";
import { GenderType } from "./user.type";

export interface IFormLogin {
    account: string;
    password: string;
}

export interface IFormChangePassword {
    password: string;
    newPassword: string;
    confirmPassword: string
}

export interface IFormProfileUser {
  avatar?: File;
  name: string;
  birthday?: Date;
  gender?: GenderType;
  phone?: string;
}

export interface IFormUpdateNameUser{
  name: string
}
