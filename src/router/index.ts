import { Fragment } from 'react';
import LoginPage from '../views/pages/login/LoginPage';
import Homepage from '../views/pages/home/Homepage';
import RegisterPage from '../views/pages/register/RegisterPage';
import OtpVerificationPage from '../views/pages/register/OtpVerificationPage';
import ForgotPassword from '../views/pages/forgotPassword/ForgotPassword';
import ConfirmAccount from '../views/pages/forgotPassword/ConfirmAccount';
import ConfirmOtp from '../views/pages/forgotPassword/ConfirmOtp';
import { urlPublicPage,urlPrivatepPage } from './constants';
import ResetPassword from '../views/pages/forgotPassword/ResetPassword';
import NotFoundPage from '../views/pages/notFoundPage/NotFoundPage';

export const routerPublic = [
    {
        path: urlPublicPage.LOGIN,
        component: LoginPage,
        layout: Fragment
    },
    {
        path: urlPublicPage.REGISTER,
        component: RegisterPage,
        layout: Fragment
    },
    {
        path: urlPublicPage.CONFIRM_OTP_REGISTER,
        component: OtpVerificationPage,
        layout: Fragment
    },
    {
        path: urlPublicPage.FORGOT_PASSWORD,
        component: ForgotPassword,
        layout: Fragment
    },
    {
        path: urlPublicPage.CONFIRM_ACCOUNT,
        component: ConfirmAccount,
        layout: Fragment
    },
    {
        path: urlPublicPage.CONFIRM_OTP_RESET_PASSWORD,
        component: ConfirmOtp,
        layout: Fragment
    },
    {
        path: urlPublicPage.RESET_PASSWORD,
        component: ResetPassword,
        layout: Fragment
    },
    {
        path: urlPublicPage.NOTFOUND,
        component: NotFoundPage,
        layout: Fragment
    },
]

export const routerPrivate = [
    {
        path: urlPrivatepPage.HOME,
        component: Homepage,
        Layout: Fragment
    },
]