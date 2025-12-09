export interface IRequestErr {
    status: number;
    message: string[],
    error: string
}

export interface IDecodedToken {
    account: string;
    sub : string;
    avatar: string;
    name:string
    iat: number;
    exp: number;
}
