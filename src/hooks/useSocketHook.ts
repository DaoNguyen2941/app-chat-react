import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useSocketStatus = () => {
    return useSelector((state: RootState) => state.socket.isConnected);
};
