
import http from "../utils/httpclient";
import { AxiosResponse } from 'axios';
import { searchUserApi } from "../utils/apiRouter";

export const SearchUserService = async (keyword: string) => {
    try {
        const url = searchUserApi.replace(":keyword", keyword);
        const response = await http.get(url);
        return response
    } catch (error) {
        throw error;
    }
}