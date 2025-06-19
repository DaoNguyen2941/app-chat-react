import http from "../utils/httpclient";
import {
    getListChatsApi,
    getChatDataById,
    getChatVirtualApi,
    createChatApi,
    chatMessageApi,
    patchReadMessages,
    deleteChatApi,
    chatGroupApi,
    chatGroupDataApi,
    chatGroupManagerMemberApi,
    groupInvititationApi,
    chatGroupMemberApi,
} from "../utils/apiRouter";
import { IChatGroupInfo, IPendingInvitationGroup } from "../type/chat.type";
import { enumInvitationStatus } from "../type/chat.type";

export const getMessageService = async (chatId: string, params: { startCursor: string | null | undefined, limit: number }) => {
    try {
        const url = chatMessageApi.replace("/:id", chatId);
        const response = await http.get(url, { params });
        return response.data
    } catch (error) {
        throw error;
    }
}

export const deleteGroupService = async (groupId: string) => {
    try {
        const url = chatGroupApi + `/${groupId}`;
        const response = await http.delete(url);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const leaveGroupService = async (groupId: string) => {
    try {
        const url = chatGroupMemberApi.replace(':groupId', groupId)
        const response = await http.delete(url);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const patchGroupInvitationReqService = async (data: { invitationId: string, status: enumInvitationStatus }) => {
    try {
        const url = groupInvititationApi + `/${data.invitationId}`
        const response = await http.patch(url, { status: data.status });
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getGroupInvitationService = async (): Promise<IPendingInvitationGroup[]> => {
    try {
        const response = await http.get(groupInvititationApi);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const addMemberToGroupService = async (groupId: string, userIds: string[]) => {
    try {
        const url = chatGroupManagerMemberApi.replace(':groupId', groupId)
        const response = await http.post(url, { memberIds: userIds });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleterMemberGroupService = async (groupId: string, userId: string) => {
    try {
        const url = chatGroupManagerMemberApi
            .replace(':groupId', groupId) + `/${userId}`
        const response = await http.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getChatGroupDataInfoService = async (groupId: string): Promise<IChatGroupInfo> => {
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

export const postMessageService = async (chatId: string, content: string) => {
    try {
        const url = chatMessageApi.replace("/:id", chatId);
        const res = await http.post(url, { content: content })
        return res
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
        const response = await http.post(chatGroupApi, { members: members, name: name })
        return response
    } catch (error) {
        throw error;
    }
}