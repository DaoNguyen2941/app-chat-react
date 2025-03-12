import { Fragment } from 'react';
import LoginPage from '../views/pages/login/LoginPage';
import Homepage from '../views/pages/home/Homepage';
import RegisterPage from '../views/pages/register/RegisterPage';
import OtpVerificationPage from '../views/pages/register/OtpVerificationPage';

export const routerPublic = [
    {
        path: `login`,
        component: LoginPage,
        layout: Fragment
    },
    {
        path: `register`,
        component: RegisterPage,
        layout: Fragment
    },
    {
        path: `/register/otp`,
        component: OtpVerificationPage,
        layout: Fragment
    },
    // {
    //     path: `home`,
    //     component: Homepage,
    //     Layout: Fragment
    // },
]

export const routerPrivate = [
    {
        path: `home`,
        component: Homepage,
        Layout: Fragment
    },
]