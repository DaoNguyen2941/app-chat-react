// socketMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { updateSocketStatus, setSocketId } from "./socketSlice";
import socketClient from "../utils/socketClient";
import { Action } from 'redux';
import { UseDecodeToken, UseCheckExpirationToken, useSetToken } from "../hooks/authHook";
export const socketMiddleware: Middleware = (store) => next => (action) => {
    const typedAction = action as Action;

    if (typedAction.type === "socket/connectSocket") {
        // Kết nối WebSocket khi action được dispatch
        socketClient.connect();
        store.dispatch(updateSocketStatus(true)); 
        store.dispatch(setSocketId(socketClient.getSocketId())); 
    }

    if (typedAction.type === "socket/disconnectSocket") {
        store.dispatch(updateSocketStatus(false));
        store.dispatch(setSocketId('')); 
        // Ngắt kết nối WebSocket
        socketClient.disconnect();
    }

    return next(action);
};
