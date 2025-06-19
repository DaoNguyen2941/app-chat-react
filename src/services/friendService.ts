import http from "../utils/httpclient";
import { postMakeFriendApi, deleteFriendApi, patchAcceptedFriendApi, getListFriendApi, getListReqFriendApi} from "../utils/apiRouter";

export const getListReqFriend = async () => {
    try {
        const response = await http.get(getListReqFriendApi)
        console.log(response);
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
  const url = patchAcceptedFriendApi.replace(":id", friendId);
  try {
    const response = await http.patch(url, { status: 'Accepted' }); // lowercase nếu backend dùng enum
    return response.data;
  } catch (error: any) {
    // Gợi ý log chi tiết để dễ debug
    console.error('Accept friend request failed:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteFriend = async (friendId: string) => {
    try {        
        const url = deleteFriendApi.replace(":id", friendId);
        const response = await http.delete(url)
        return response
    } catch (error) {
        throw error;
    }
}