import { IDecodedToken } from '../type/type';
import { jwtDecode } from "jwt-decode";

export const useSetToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const UseDecodeToken = (token: string | null): IDecodedToken | null => {
    if (token === null) {
        return null
    }
    try {
        return jwtDecode(token);
    } catch (error) {
        localStorage.removeItem('token');
        return null
    }
}

export const UseCheckExpirationToken = (cookieDecode: IDecodedToken): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expiredTime = cookieDecode.exp;
    return expiredTime < currentTime;
}