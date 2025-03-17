import http from "../utils/httpclient";
import {
    getListChatsApi,
    getChatDataById,
    getChatVirtualApi,
    createChatApi,
    postMessageApi,
    patchReadMessages
} from "../utils/apiRouter";

export const readMessageService = async (chatId: string) => {
    try {        
        console.log(chatId);
        
        const url = patchReadMessages.replace("/:id", chatId);
        console.log(url);
        
        const response = await http.patch(url)
        return response
    } catch (error) {
        throw error;
    }
}

export const postMessageService = async (chatId: string, connect: string) => {
    try {
        const url = postMessageApi.replace("/:id", chatId);
        return await http.post(url, { content: connect })
    } catch (error) {
        throw error;
    }
}

export const GetListChatService = async () => {
    try {
        const response = await http.get(getListChatsApi);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getChatDataService = async (chatid: string) => {
    try {
        const url = getChatDataById.replace("/:id", chatid);
        const response = await http.get(url)
        return response
    } catch (error) {
        throw error;
    }
}

export const getVirtualChatDataService = async (userId: string) => {
    try {
        const url = getChatVirtualApi.replace(":userId", userId);
        const response = await http.get(url)
        return response
    } catch (error) {
        throw error;
    }
}

export const createChatService = async (receiverId: string) => {
    try {
        const response = await http.post(createChatApi, { receiverId })
        return response
    } catch (error) {
        throw error;
    }
}