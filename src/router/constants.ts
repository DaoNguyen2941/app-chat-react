
export const urlPublicPage = {
    LOGIN: `/login`,
    REGISTER: `/register`,
    CONFIRM_OTP_REGISTER: `/register/otp`,
    FORGOT_PASSWORD: `/login/identify`,
    CONFIRM_ACCOUNT: `/login/identify/confirm`,
    CONFIRM_OTP_RESET_PASSWORD: `/login/identify/confirm/otp`,
    RESET_PASSWORD: `/login/identify/password/reset`,
    NOTFOUND: `/*`
}

export const urlPrivatepPage = {
    HOME: `/home`,
    MENU: {
        PROFILE: '/menu/profile',
        UPDATE_PROFILE: '/menu/profile/update',
        UPDATE_PASSWORD: '/menu/password/update',
        FRIENDS: '/menu/friends',
        GROUPS: '/menu/groups',
        GROUPS_INFO: '/menu/groups/:groupId',
    }
}