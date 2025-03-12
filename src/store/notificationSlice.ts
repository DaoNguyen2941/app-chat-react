import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '.';

interface INumberNotification {
    invitation: number;
    total: number;
};

const initialState: INumberNotification = {
    invitation: 0,
    total: 0 
}

const notificationSlice = createSlice({
    name: 'numberNotification',
    initialState,
    reducers: {
        setNumberInvitation: (state, action: PayloadAction<number>) => {            
            state.invitation = action.payload;
            state.total = state.invitation ;
        },
        exceptOneAnnouncement: (state) =>{
            state.invitation = state.invitation - 1;
            state.total = state.invitation ;
        }

    },
});

export const { setNumberInvitation, exceptOneAnnouncement }  = notificationSlice.actions;
export const notification = (state: RootState): INumberNotification  => state.notification
export default notificationSlice.reducer