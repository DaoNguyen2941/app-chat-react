import { Fragment } from 'react';
import LoginPage from '../views/pages/login/LoginPage';
import Homepage from '../views/pages/home/Homepage';
import RegisterPage from '../views/pages/register/RegisterPage';
import OtpVerificationPage from '../views/pages/register/OtpVerificationPage';
import ForgotPassword from '../views/pages/forgotPassword/ForgotPassword';
import ConfirmAccount from '../views/pages/forgotPassword/ConfirmAccount';
import ConfirmOtp from '../views/pages/forgotPassword/ConfirmOtp';
import { urlPublicPage, urlPrivatepPage } from './constants';
import ResetPassword from '../views/pages/forgotPassword/ResetPassword';
import NotFoundPage from '../views/pages/notFoundPage/NotFoundPage';
import MenusLayout from '../views/pages/menu/layout/menuLayout';
import UserProfile from '../views/pages/menu/option/UserProfile';
import FriendsList from '../views/pages/menu/option/FriendsList';
import GroupList from '../views/pages/menu/option/GroupsList';
import UpdatePassword from '../views/pages/menu/option/UpdatePassword';
import UserProfileForm from '../views/pages/menu/option/UpdateProfile';
import GroupDetailPage from '../views/pages/menu/DetailPage/GroupDetailPage';
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
    // {
    //     path: urlPublicPage.NOTFOUND,
    //     component: NotFoundPage,
    //     layout: Fragment
    // },
]

export const routerPrivate = [
    {
        path: urlPrivatepPage.HOME,
        component: Homepage,
        Layout: Fragment
    },
    {
        path: urlPrivatepPage.MENU.PROFILE,
        component: UserProfile,
        Layout: MenusLayout,
    },
    {
        path: urlPrivatepPage.MENU.GROUPS,
        component: GroupList,
        Layout: MenusLayout,
    },
    {
        path: urlPrivatepPage.MENU.FRIENDS,
        component: FriendsList,
        Layout: MenusLayout,
    },
    {
        path: urlPrivatepPage.MENU.UPDATE_PASSWORD,
        component: UpdatePassword,
        Layout: MenusLayout,
    },
    {
        path: urlPrivatepPage.MENU.UPDATE_PROFILE,
        component: UserProfileForm,
        Layout: MenusLayout,
    },
    {
        path: urlPrivatepPage.MENU.GROUPS_INFO,
        component: GroupDetailPage,
        Layout: MenusLayout,
    },
]