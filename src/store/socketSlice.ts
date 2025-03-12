import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '.';

interface SocketState {
    isConnected: boolean;
    socketId: string | null;
    chatIsOpent: string | null
}

const initialState: SocketState = {
  isConnected: false,
  socketId: null,
  chatIsOpent: null
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        updateSocketStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },

        setSocketId: (state, action: PayloadAction<string | null>) => {
            state.socketId = action.payload;
        },

        setChatOpent: (state, action: PayloadAction<string | null>) => {
            state.chatIsOpent = action.payload;
        },

        connectSocket: (state) => {
            // Action này sẽ kích hoạt việc kết nối trong middleware
        },
        disconnectSocket: (state) => {
            // Action này sẽ kích hoạt việc ngắt kết nối trong middleware
        }
    },
});

export const {
    updateSocketStatus,
    disconnectSocket,
    setSocketId,
    connectSocket,
    setChatOpent
} = socketSlice.actions;

export const ChatIsOpent = (state: RootState): string | null => state.socket.chatIsOpent;
export default socketSlice.reducer;
