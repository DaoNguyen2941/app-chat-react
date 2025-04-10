import http from "../utils/httpclient";
import {
    getListChatsApi,
    getChatDataById,
    getChatVirtualApi,
    createChatApi,
    postMessageApi,
    patchReadMessages,
    createChatGroupApi2,
    deleteChatApi,
} from "../utils/apiRouter";

export const deleteChatService = async (chatId: string, isGroup: boolean) => {
    try {
        const url = deleteChatApi.replace(":id", chatId) + `?isGroup=${isGroup}`;
        const response = await http.delete(url)
        return response
    } catch (error) {
        throw error;
    }
}

export const readMessageService = async (chatId: string) => {
    try {                
        const url = patchReadMessages.replace("/:id", chatId);
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

export const createChatGroupService = async (members: string[],name: string) => {
    try {
        const response = await http.post(createChatGroupApi2, { members: members, name: name })
        return response
    } catch (error) {
        throw error;
    }
}