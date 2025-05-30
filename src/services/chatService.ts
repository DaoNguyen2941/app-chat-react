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
    chatGroupApi,
    chatGroupDataApi,
    chatGroupMemberApi,
    groupInvititationApi
} from "../utils/apiRouter";
import { IChatGroupInfo, IChat, IPendingInvitationGroup } from "../commom/type/chat.type";
import { enumInvitationStatus } from "../commom/type/chat.type";

export const patchGroupInvitationReqService = async (data:{invitationId: string, status: enumInvitationStatus}) => {
    try {
        const url = groupInvititationApi + `/${data.invitationId}`
        const response = await http.patch(url, {status: data.status});
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getGroupInvitationReqService = async (): Promise<IPendingInvitationGroup[]> => {
    try {
        const response = await http.get(groupInvititationApi);
        console.log(response.data);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const addMemberToGroupService = async (groupId: string, userId: string) => {

}

export const deleterMemberGroupService = async (groupId: string, userId: string) => {
    try {
        const url = chatGroupMemberApi
            .replace(':groupId', groupId)
            .replace(':userId', userId);
        const response = await http.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getChatGroupDataService = async (groupId: string): Promise<IChatGroupInfo> => {
    try {
        const url = chatGroupDataApi.replace(":id", groupId);
        const response = await http.get(url)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getListChatGroupService = async () => {
    try {
        const response = await http.get(chatGroupApi);
        return response.data
    } catch (error) {
        throw error;
    }
}

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

export const getListChatService = async () => {
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

export const createChatGroupService = async (members: string[], name: string) => {
    try {
        const response = await http.post(createChatGroupApi2, { members: members, name: name })
        return response
    } catch (error) {
        throw error;
    }
}