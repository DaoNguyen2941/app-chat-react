export const host = "http://localhost:3001";
export const hostsocket = "http://localhost:3001";

export const loginApi = `${host}/auth/login`;
export const registerApi = `${host}/auth/register`;
export const verifyOtpApi = `${host}/auth/register/verify-otp`;
export const refreshTokenAPI = `${host}/auth/refresh`;
export const logoutApi = `${host}/auth/logout`;

export const createChatApi = `${host}/chat` ;
export const createChatGroupApi = `${host}/chat/group` ;
export const createChatGroupApi2 = `${host}/chat/group/api2` ;
export const getListChatsApi = `${host}/chat/list` ;
export const getChatDataById = `${host}/chat/:id`;
export const getChatVirtualApi = `${host}/chat/virtual/:userId` ;
export const postMessageApi = `${host}/chat/:id/message`;
export const patchReadMessages = `${host}/chat/:id/unreadCount`


export const searchUserApi = `${host}/user/search/:keyword`;

export const postMakeFriendApi = `${host}/friend`;
export const patchAcceptedFriendApi = `${host}/friend/requests/:id/accepted`;
export const getListFriendApi = `${host}/friend/lists`
export const deleteFriendApi = `${host}/friend/requests/:id`;
export const getListReqFriendApi = `${host}/friend/requests/lists`;

