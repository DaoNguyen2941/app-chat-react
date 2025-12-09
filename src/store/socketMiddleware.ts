import { Middleware } from "@reduxjs/toolkit";
import { updateSocketStatus, setSocketId } from "./socketSlice";
import socketClient from "../utils/socketClient";
import { Action } from 'redux';
export const socketMiddleware: Middleware = (store) => next => (action) => {
    const typedAction = action as Action;

    if (typedAction.type === "socket/connectSocket") {
        socketClient.connect();
        store.dispatch(updateSocketStatus(true)); 
        store.dispatch(setSocketId(socketClient.getSocketId())); 
    }

    if (typedAction.type === "socket/disconnectSocket") {
        store.dispatch(updateSocketStatus(false));
        store.dispatch(setSocketId('')); 
        socketClient.disconnect();
    }

    return next(action);
};
