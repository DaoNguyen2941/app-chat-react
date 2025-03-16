import { io, Socket } from "socket.io-client";
import { hostsocket } from "./apiRouter";
import { setSocketId, updateSocketStatus, connectSocket, disconnectSocket } from "../store/socketSlice";
import { setNumberInvitation, notification } from "../store/notificationSlice"
import { store } from "../store/index";
import { UseCheckExpirationToken } from "../hooks/authHook";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { IDecodedToken } from "../commom/type/type";
import { refreshTokenService } from "../services/authService";
import { IChatData, Imessage, IChat } from "../commom/type/chat.type";
import { queryClient } from "../services/cacheService";

class SocketClient {
    private socket: Socket | null = null;
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    connect(): Socket {
        if (this.socket && this.socket.connected) {
            return this.socket;
        }
        const token = localStorage.getItem("token");
        if (!this.socket) {
            this.socket = io(this.baseURL, {
                auth: {
                    token: `${token}`, // Gắn token vào auth
                },
                transports: ["websocket"], // Tùy chọn các giao thức
                // Timeout cho kết nối
                timeout: 5000,
                reconnection: true, // Tự động kết nối lại
                reconnectionAttempts: 5, // Thử lại tối đa 5 lần
                reconnectionDelay: 2000, // Thời gian chờ giữa các lần thử
            });

            this.setupListeners();
        }

        return this.socket;
    }

    private setupListeners(): void {
        if (!this.socket) return;
        // Xử lý sự kiện kết nối
        this.socket.on("connect", () => {
            this.handleConnect()
        });

        // Xử lý lỗi kết nối
        this.socket.on("connect_error", async (error: any) => {
            console.error("🚨 Lỗi kết nối:");
            console.log(error);
            
            if (error.message.includes("jwt expired")) { // Kiểm tra lỗi do token hết hạn
                try {
                    console.warn("🔄 Token hết hạn, thử refresh...");
                    const res = await refreshTokenService();
                    if (res) {
                        const newToken = res.data.token;
                        localStorage.setItem('token', newToken);
                        this.updateToken(newToken); // Cập nhật token mới & reconnect
                    }
                } catch (err) {
                    console.error("❌ Không thể làm mới token:", err);
                    this.socket?.disconnect(); // Ngắt kết nối nếu không thể refresh token
                }
            }
        });

        // Xử lý ngắt kết nối
        this.socket.on("disconnect", (reason: string) => {
            localStorage.setItem('socketStatus', JSON.stringify({ connected: "false", socketId: 'null' }))
            store.dispatch(disconnectSocket());
        });
    }

    private handleConnect() {
        localStorage.setItem('socketStatus', JSON.stringify({ connected: "true", socketId: this.socket?.id }));
        store.dispatch(connectSocket());
        this.listenToNotificationsFromFriends();
        this.listenToNewMessages();
    };

    private listenToNewMessages() {
        if (!this.socket?.hasListeners("new-message")) {            
            this.socket?.on("new-message", (data: { messageData: Imessage, chatId: string }) => {
                console.log('new message');
                
                const { messageData, chatId } = data;
                const chatISOpent = store.getState().socket.chatIsOpent
                queryClient.setQueryData(["chatData", chatId], (oldData: IChatData) => ({
                    ...oldData,
                    message: [...(oldData?.message || []), messageData],
                }));
                if (chatISOpent !== chatId) {
                    console.log('test');
                    queryClient.setQueryData(["listChat"], (oldData: IChat[] | []) =>
                        oldData
                            ? oldData.map(chat =>
                                chat.id === chatId ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 } : chat
                            )
                            : oldData
                    );
                }
            });
        }
    }

    private listenToNotificationsFromFriends() {
        if (!this.socket?.hasListeners("Notifications-from-friends")) {
            this.socket?.on('Notifications-from-friends', (data: any) => {
                console.log(data);
                const newNumberInvitation = store.getState().notification.invitation
                store.dispatch(setNumberInvitation(newNumberInvitation + 1))
            })
        }
    }

    updateToken(token: string) {
        if (!this.socket) {
            this.connect();
            return;
        }
    
        this.socket.auth = { token: token };
    
        // Kiểm tra nếu socket đã disconnect thì kết nối lại
        if (this.socket.disconnected) {
            console.warn("🔄 Token được cập nhật, kết nối lại WebSocket...");
            this.socket.connect();
        }
    }

    getSocketId(): string | null {
        if (!this.socket) {
            return null
        }
        return this.socket.id ? this.socket.id : null;
    }

    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
    }

    emit(event: string, data: any): void {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: (...args: any[]) => void): void {
        this.socket?.on(event, callback);
    };

    off(event: string, callback: (...args: any[]) => void): void {
        this.socket?.off(event, callback);
    };
}

const socketClient = new SocketClient(`${hostsocket}`); // Thay bằng URL server của bạn
export default socketClient;
