import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '.';

interface INumberNotification {
    friendInvitation: number;
    groupInvitation: number;
    total: number;
};

const initialState: INumberNotification = {
    friendInvitation: 0,
    groupInvitation: 0,
    total: 0
}

const notificationSlice = createSlice({
    name: 'numberNotification',
    initialState,
    reducers: {
        setFriendInvitation: (state, action: PayloadAction<number>) => {
            state.friendInvitation = action.payload;
            state.total = state.friendInvitation + state.groupInvitation;
        },
        excludeAFriendNotification: (state) => {
            state.friendInvitation = state.friendInvitation - 1;
            state.total = state.friendInvitation + state.groupInvitation;
        },
        setGroupInvitation: (state, action: PayloadAction<number>) => {
            state.groupInvitation = action.payload;
            state.total = state.friendInvitation + state.groupInvitation;
        },
        excludeAGroupNotification: (state) => {
            state.groupInvitation = state.friendInvitation - 1;
            state.total = state.friendInvitation + state.groupInvitation;
        },
    },
});

export const { setFriendInvitation, excludeAFriendNotification, setGroupInvitation, excludeAGroupNotification} = notificationSlice.actions;
export const notification = (state: RootState): INumberNotification => state.notification
export default notificationSlice.reducer