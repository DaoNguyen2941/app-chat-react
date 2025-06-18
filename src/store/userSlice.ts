import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUserData } from "../commom/user.type";
import { IDecodedToken } from "../commom/type";
import { UseDecodeToken } from "../hooks/authHook";

const getUserDataFromToken = (): IUserData | null => {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    const decodedToken: IDecodedToken | null = UseDecodeToken(token);
    if (!decodedToken) {
        return null;
    }
    const userData: IUserData = {
        id: decodedToken.sub,
        account: decodedToken.account,
        avatar: decodedToken.avatar,
        name: decodedToken.name
    };
    return userData;
};

const initialState: IUserData = {
    id: getUserDataFromToken()?.id || "",
    account: getUserDataFromToken()?.account || "",
    avatar: getUserDataFromToken()?.avatar || "",
    name: getUserDataFromToken()?.name || "",
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<IUserData>) => {
            state.account = action.payload.account;
            state.id = action.payload.id;
            state.avatar = action.payload.avatar;
            state.name = action.payload.name
        },

        updateUserData: (state) => {
            const userData: IUserData | null = getUserDataFromToken();
            state.id = userData?.id || "";
            state.account = userData?.account || "";
            state.avatar = userData?.avatar || "";
            state.name = userData?.name || "";
        },

        deleteUserData: (state) => {
            state.id = "";
            state.account = "";
            state.avatar = "";
            state.name = ""
        },

        setAvatarorName: (state, action: PayloadAction<{ avatar?: string, name?: string }>) => {
            state.avatar = action.payload.avatar || state.avatar;
            state.name = action.payload.name || state.name
        }

    }
})

export const {
    setUserData,
    updateUserData,
    deleteUserData,
    setAvatarorName
} = userSlice.actions

export const userData = (state: RootState) => state.userData;

export default userSlice.reducer;