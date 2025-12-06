import { io, Socket } from "socket.io-client";
import { hostsocket } from "./apiRouter";
import { connectSocket, disconnectSocket } from "../store/socketSlice";
import { setFriendInvitation, setGroupInvitation } from "../store/notificationSlice"
import { store } from "../store/index";
import { refreshTokenService } from "../services/authService";
import { IChatData, Imessage, IChat } from "../type/chat.type";
import { queryClient } from "../services/cacheService";
import { readMessageService } from "../services/chatService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IDataFriendReqType } from "../type/friend.type";
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
                reconnectionAttempts: 3, // Thử lại tối đa 5 lần
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
        this.listentoNewGroupChat()
        this.listenToInveteGroup()
    };

    private listentoNewGroupChat() {
        if (!this.socket?.hasListeners("new-group-chat")) {
            this.socket?.on('new-group-chat', (data: { message: string }) => {
                queryClient.refetchQueries({ queryKey: ['listChat'] });
            })
        }
    }

    // sau khi server sửa dữ liệu gửi về thì có thể push trực tiếp vào cache ko cần refetch lại cache 
    private listenToInveteGroup() {
        if (!this.socket?.hasListeners("invete-group")) {
            this.socket?.on('invete-group', (data: any) => {
                const newNumberInvitation = store.getState().notification.groupInvitation
                store.dispatch(setGroupInvitation(newNumberInvitation + 1))
                queryClient.refetchQueries({ queryKey: ['group-invitation'] });

            })
        }
    }

    private listenToNewMessages() {
        if (!this.socket?.hasListeners("new-message")) {
            this.socket?.on("new-message", (data: { messageData: Imessage, chatId: string, isNewChat: boolean, isGroup: boolean }) => {
                const { messageData, chatId, isNewChat, isGroup } = data;
                const chatISOpent = store.getState().socket.chatIsOpent;
                console.log(messageData);
                
                if (isNewChat) {
                    queryClient.refetchQueries({ queryKey: ['listChat'] });
                } else {
                    if (chatISOpent !== chatId) {
                        queryClient.setQueryData(["listChat"], (oldData: IChat[] | []) => {
                            if (!oldData || oldData.length === 0) return oldData;

                            const chatIndex = oldData.findIndex(chat => chat.id === chatId);
                            if (chatIndex === -1) return oldData;

                            const chat = oldData[chatIndex];

                            const updatedChat = {
                                ...chat,
                                unreadCount: (chat.unreadCount || 0) + 1,
                            };

                            if (chatIndex === 0) {
                                return [updatedChat, ...oldData.slice(1)];
                            } else {
                                return [updatedChat, ...oldData.filter((_, i) => i !== chatIndex)];
                            }
                        });

                    } else {
                        try {
                            queryClient.setQueryData(["chatData", chatId], (oldData: IChatData | undefined) => ({
                                ...oldData,
                                message: [...(oldData?.message || []), messageData],
                            }));
                            queryClient.setQueryData(["listChat"], (oldChats: IChat[] = []) => {
                                const chatIndex = oldChats.findIndex(chat => chat.id === chatId);
                                if (chatIndex === -1) return oldChats;

                                const chat = oldChats[chatIndex];
                                if (chatIndex === 0) return oldChats;
                                return [chat, ...oldChats.filter((_, i) => i !== chatIndex)];
                            });

                            readMessageService(isGroup ? `/group/${chatId}` : `/${chatId}`);
                        } catch (error) {
                            toast.error("Có lỗi khi cập nhật tin nhắn mới.");
                        }
                    }
                }

            });
        }
    }

    private listenToNotificationsFromFriends() {
        if (!this.socket?.hasListeners("Notifications-from-friends")) {
            this.socket?.on('Notifications-from-friends', (data: IDataFriendReqType) => {
                console.log(data);

                // Cập nhật số lượng thông báo trong Redux
                const newNumberInvitation = store.getState().notification.friendInvitation;
                store.dispatch(setFriendInvitation(newNumberInvitation + 1));

                // Cập nhật cache friend-requests
                queryClient.setQueryData<IDataFriendReqType[]>(["friend-requests"], (oldData) => {
                    if (!oldData) return [data]; // Nếu chưa có dữ liệu cũ, khởi tạo mảng mới
                    return [data, ...oldData];   // Thêm phần tử mới vào đầu
                });
            });
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

const socketClient = new SocketClient(`${hostsocket}`);
export default socketClient;
