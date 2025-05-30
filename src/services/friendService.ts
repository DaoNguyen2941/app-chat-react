import http from "../utils/httpclient";
import { postMakeFriendApi, deleteFriendApi, patchAcceptedFriendApi, getListFriendApi, getListReqFriendApi} from "../utils/apiRouter";

export const getListReqFriend = async () => {
    try {
        console.log('getListReqFriend được gọi' );
        const response = await http.get(getListReqFriendApi)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListFriend = async () => {
    try {
        const response = await http.get(getListFriendApi)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const makeFriendService = async (userId: string) => {
    try {
        const response = await http.post(postMakeFriendApi, { receiverId: userId });
        return response;
    } catch (error) {
        throw error;
    }

}

export const acceptedFriend = async (friendId: string) => {
    try {
        const url = patchAcceptedFriendApi.replace(":id", friendId);
        const response = await http.patch(url)
        return response
    } catch (error) {
        throw error;
    }
}

export const deleteFriend = async (friendId: string) => {
    try {        
        const url = deleteFriendApi.replace(":id", friendId);
        const response = await http.delete(url)
        return response
    } catch (error) {
        throw error;
    }
}