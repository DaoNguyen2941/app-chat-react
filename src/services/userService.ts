
import http from "../utils/httpclient";
import {
    searchUserApi,
    getUserProfileApi,
    changeUserPasswordApi,
    changeUserNameApi,
    changeUserAvatarApi,
    getUserApi
} from "../utils/apiRouter";
import { IUser, IUserType } from "../type/user.type";
import { IFormChangePassword, IFormUpdateNameUser } from "../type/form.type";


export const getUserDataService = async (userId: string): Promise<IUserType> => {
    try {
        const url = getUserApi.replace(":id", userId);
        const response = await http.get(url)        
        return response.data;
    } catch (error) {
        throw error;
    }

}

export const changeUserAvatarService = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await http.post(changeUserAvatarApi, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};


export const changeUserNameService = async (formData: IFormUpdateNameUser) => {
    try {
        const response = await http.patch(changeUserNameApi, formData)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const changeUserPasswordService = async (formData: IFormChangePassword) => {
    try {
        const { password, newPassword } = formData
        const data = {
            password,
            newPassword
        }
        const response = await http.post(changeUserPasswordApi, data)
        return response
    } catch (error) {
        throw error;
    }
}

export const SearchUserService = async (keyword: string) => {
    try {
        const url = searchUserApi.replace(":keyword", keyword);
        const response = await http.get(url);
        return response
    } catch (error) {
        throw error;
    }
}

export const getUserProfile = async (): Promise<IUser> => {
    try {
        const response = await http.get(getUserProfileApi);
        return response.data
    } catch (error) {
        throw error;
    }
}