import http from "../utils/httpclient";
import socketClient from "../utils/socketClient";
import { AxiosResponse } from 'axios';
import { IFormLogin } from "../type/form.type";
import {
    loginApi,
    registerApi,
    verifyOtpApi,
    refreshTokenAPI,
    logoutApi,
    identifyApi,
    getOtpForgotPasswordApi,
    OTPConfirmationResetPasswordApi,
    resetPasswordApi,
} from "../utils/apiRouter";
import { IFormRegister } from "../views/pages/register/intreface";
import { IFormOtp } from "../views/pages/register/intreface";
import { IFormIdentify } from "../views/pages/forgotPassword/ForgotPassword";
import { IFormResetPassword } from "../views/pages/forgotPassword/ResetPassword";

export const resetPasswordService = async (formData: IFormResetPassword): Promise<AxiosResponse> => {
    if (formData.password !== formData.confirmPassword) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp');
    }
    try {
        const response = await http.post(resetPasswordApi, {
            password: formData.password,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const confirmOtpResetPasswordService = async (tocken: string, otp: string): Promise<AxiosResponse> => {
    try {
        const url = OTPConfirmationResetPasswordApi.replace(":token", tocken);
        const response = await http.post(url, {OTP: otp});
        return response
    } catch (error) {
        throw error;
    }
}

export const getOtpForgotPasswordService = async (tocken: string): Promise<AxiosResponse> => {
    try {
        const url = getOtpForgotPasswordApi.replace(":token", tocken);
        const response = await http.get(url);
        return response
    } catch (error) {
        throw error;
    }
}

export const identifyService = async (data: IFormIdentify) => {
    try {
        const response = await http.post(identifyApi, data);
        return response
    } catch (error) {
        throw error;
    }
}

export const refreshTokenService = async (): Promise<AxiosResponse | null> => {
    try {
        const response = await http.get(refreshTokenAPI);
        const newToken = response.data.token
        if (newToken) {
            socketClient.updateToken(newToken);
        }
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

export const logOutService = async () => {
    try {
        const response = await http.post(logoutApi);
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