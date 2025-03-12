import http from "../utils/httpclient";
import socketClient from "../utils/socketClient";
import { AxiosResponse, AxiosError } from 'axios';
import { IFormLogin } from "../views/pages/login/intreface";
import { loginApi, registerApi, verifyOtpApi, refreshTokenAPI } from "../utils/apiRouter";
import { IFormRegister } from "../views/pages/register/intreface";
import { IFormOtp } from "../views/pages/register/intreface";

export const refreshTokenService = async (): Promise<AxiosResponse | null > => {
    try {
        const response = await http.get(refreshTokenAPI);
        const newToken = response.data.token
        socketClient.updateToken(newToken)
        // socketClient.emit('updateToken', newToken)
        return response;
    } catch (error) {
        throw error;
    }
};

export const loginService = async (account: IFormLogin): Promise<AxiosResponse> => {
    try {
        const response = await http.post(loginApi, account)
        return response
    } catch (err) {
        throw err;
    }
}

export const registerService = async (userData: IFormRegister): Promise<AxiosResponse> => {
    try {
        const response = await http.post(registerApi, userData)
        return response
    } catch (err) {
        throw err;
    }
}

export const verifyOtpService = async (otp: IFormOtp): Promise<AxiosResponse> => {
    try {
        const response = await http.post(verifyOtpApi, otp)
        return response
    } catch (err) {
        throw err;
    }
}