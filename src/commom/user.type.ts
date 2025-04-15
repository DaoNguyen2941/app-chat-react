interface IProfileUser {
    id: string;
    email: string;
    account:string;
    password:string;
    avatar: string;
    name:string;
}

export interface IFormLogin extends Pick<IProfileUser, 'account' | 'password'> {}

export interface IUserData extends Pick<IProfileUser, "account" | "id" | 'avatar'| 'name' > {}
