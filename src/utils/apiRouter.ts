export const host = "http://localhost:3001";
export const hostsocket = "http://localhost:3001";
//auth
export const loginApi = `${host}/auth/login`;
export const registerApi = `${host}/auth/register`;
export const verifyOtpApi = `${host}/auth/register/verify-otp`;
export const refreshTokenAPI = `${host}/auth/refresh`;
export const logoutApi = `${host}/auth/logout`;
//chat
export const createChatApi = `${host}/chat` ;
export const chatGroupApi = `${host}/chat/group` ;
export const createChatGroupApi2 = `${host}/chat/group/api2` ;
export const getListChatsApi = `${host}/chat/list` ;
export const getChatDataById = `${host}/chat/:id`;
export const deleteChatApi = `${host}/chat/:id/`;
export const getChatVirtualApi = `${host}/chat/virtual/:userId` ;
export const postMessageApi = `${host}/chat/:id/message`;
export const patchReadMessages = `${host}/chat/:id/unreadCount`
export const chatGroupDataApi = `${host}/chat/group/:id` ;
export const chatGroupMemberApi = `${host}/chat/group/:groupId/manager/members/:userId`;
export const groupInvititationApi = `${host}/chat/group/invitation`;
//user
export const searchUserApi = `${host}/user/search/:keyword`;
export const identifyApi = `${host}/user/identify`;
export const getOtpForgotPasswordApi = `${host}/user/identify/forgot-password/otp/:token`;
export const OTPConfirmationResetPasswordApi = `${host}/user/identify/forgot-password/otp/validate/:token`;
export const resetPasswordApi = `${host}/user/identify/forgot-password/reset`;
export const getUserProfileApi = `${host}/user/profile`;
export const changeUserPasswordApi = `${host}/user/password/change`;
export const changeUserNameApi = `${host}/user/name`;
export const changeUserAvatarApi = `${host}/user/avatar`;
export const getUserApi = `${host}/user/:id`;

//friend
export const postMakeFriendApi = `${host}/friend`;
export const patchAcceptedFriendApi = `${host}/friend/requests/:id/accepted`;
export const getListFriendApi = `${host}/friend/lists`
export const deleteFriendApi = `${host}/friend/requests/:id`;
export const getListReqFriendApi = `${host}/friend/requests/lists`;