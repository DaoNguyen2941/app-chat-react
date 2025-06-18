import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getChatDataService, readMessageService, postMessageService } from '../../../../services/chatService';
import { IChatData, IChat, IMessagePage } from '../../../../commom/chat.type';
import { setChatOpent } from '../../../../store/socketSlice';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import TimeAgo from './elements/TimeAgo';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHook';
import { userData } from '../../../../store/userSlice';
import { getMessageService } from '../../../../services/chatService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Chat({ chatId }: { chatId: string }) {
    const dispatch = useAppDispatch();
    const dataUser = useAppSelector(userData);
    const queryClient = useQueryClient();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const isAtBottomRef = useRef(true);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const lastMessageIdRef = useRef<string | null>(null);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        if (inputRef.current) {
            const input = inputRef.current;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;

            const newMessage = message.slice(0, start) + emojiData.emoji + message.slice(end);
            setMessage(newMessage);

            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
            }, 0);
        }
    };

    const { data: chatData } = useQuery<IChatData, Error>({
        queryKey: ['chatData', chatId.split("/").filter(Boolean).pop()],
        queryFn: async () => {
            const response = await getChatDataService(chatId);
            return response.data;
        },
    });

    const { mutate: getMessages } = useMutation<IMessagePage>({
        mutationFn: () => getMessageService(chatId, { startCursor: chatData?.pagination?.nextCursor, limit: 20 }),
        onSuccess: (data) => {
            setIsFetchingMore(false);

            const chatContainer = chatBoxRef.current;
            if (!chatContainer) return;

            const previousScrollHeight = chatContainer.scrollHeight;

            const extractId = chatId.split("/").filter(Boolean).pop() || "";
            queryClient.setQueryData(["chatData", extractId], (oldData?: IChatData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    message: [...data.messages, ...oldData.message],
                    pagination: data.pagination,
                };
            });

            // Sau khi cập nhật state → chờ DOM render xong rồi chỉnh lại scroll
            setTimeout(() => {
                if (!chatContainer) return;
                const newScrollHeight = chatContainer.scrollHeight;
                chatContainer.scrollTop = newScrollHeight - previousScrollHeight;
            }, 10);
        },
        onError: () => {
            setIsFetchingMore(false);
        }
    })

    const { mutate: readMessage } = useMutation({
        mutationFn: () => readMessageService(chatId),
        onSuccess: () => {
            const idChat = chatId.slice(1);
            queryClient.setQueryData(["listChat"], (oldData: IChat[] | []) =>
                oldData
                    ? oldData.map(chat => {
                        const chatIdToCompare = chat.IsGroup ? idChat.slice(6) : idChat;
                        return chat.id === chatIdToCompare ? { ...chat, unreadCount: 0 } : chat;
                    })
                    : oldData
            );
        },
    });

    useEffect(() => {
        const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
        let presentChat;
        if (chatId.includes('group')) {
            dispatch(setChatOpent(chatId.slice(7)));
            presentChat = listChat.find(chat => chat.id === chatId.slice(7));
        } else {
            dispatch(setChatOpent(chatId.slice(1)));
            presentChat = listChat.find(chat => chat.id === chatId.slice(1));
        }
        if (presentChat?.unreadCount && presentChat.unreadCount > 0) {
            readMessage();
        }
    }, [chatId]);

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: (keyword: string) => postMessageService(chatId, keyword),
        onSuccess(res) {
            const extractId = chatId.split("/").filter(Boolean).pop() || "";
            queryClient.setQueryData(["chatData", extractId], (oldData?: IChatData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    message: [...(oldData.message || []), res.data],
                };
            });
            queryClient.setQueryData(["listChat"], (oldChats: IChat[] = []) => {
                const chatIndex = oldChats.findIndex(chat => chat.id === extractId);
                if (chatIndex === -1) return oldChats;

                const chat = oldChats[chatIndex];
                if (chatIndex === 0) return oldChats;
                return [chat, ...oldChats.filter((_, i) => i !== chatIndex)];
            });
        },
    });

    const handleSendMessage = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
        if (showEmojiPicker) setShowEmojiPicker(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    // Tự scroll xuống cuối khi gửi message mới (tin nhắn cuối là của mình)
    useEffect(() => {
        const messages = chatData?.message;
        if (!messages || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const currentLastMessageId = lastMessage?.id;

        // Nếu ID cuối khác với lần trước → mới thực sự là tin nhắn mới
        const isNewMessage =
            currentLastMessageId && currentLastMessageId !== lastMessageIdRef.current;

        // Cập nhật ref
        lastMessageIdRef.current = currentLastMessageId;

        const isOwn = lastMessage?.author?.id === dataUser.id;

        if (isNewMessage && (isOwn || isAtBottomRef.current)) {
            const timer = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
            setHasNewMessage(false); // ẩn nút
            return () => clearTimeout(timer);
        }

        if (isNewMessage && !isOwn && !isAtBottomRef.current) {
            setHasNewMessage(true); // hiện nút
        }
    }, [chatData?.message]);





    const handleScroll = () => {
        const container = chatBoxRef.current;
        if (!container || isFetchingMore) return;

        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        isAtBottomRef.current = isAtBottom;

        if (container.scrollTop === 0 && chatData?.pagination.hasMore) {
            setIsFetchingMore(true);
            getMessages();
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid #ddd",
                borderRight: "1px solid #ddd",
            }}
        >
            {/* 🟦 Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // đẩy về trái
                    gap: 1,  // khoảng cách avatar - tên, bạn giảm nhỏ nếu muốn
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid #eee',
                }}
            >
                {chatData?.isGroup ? (
                    <AvatarGroup max={3}>
                        {chatData?.members?.map((m, idx) => (
                            <Avatar key={idx} alt="" src={m.avatar} />
                        ))}
                    </AvatarGroup>
                ) : (
                    <Avatar src={chatData?.user?.avatar} />
                )}

                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {chatData?.user?.name || chatData?.name}
                </Typography>
            </Box>

            <Box sx={{ height: "1px", backgroundColor: "#ccc" }} />

            {/* 💬 Message List */}
            <Box
                ref={chatBoxRef}
                onScroll={handleScroll}

                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 3,
                    py: 2,
                }}
            >
                {chatData?.message?.map((message) => {
                    const isOwn = message.author?.id === dataUser.id;
                    return (
                        <Box
                            key={message?.id}
                            sx={{
                                display: "flex",
                                flexDirection: isOwn ? "row-reverse" : "row",
                                alignItems: "flex-start",
                                mb: 2,
                            }}
                        >
                            <Avatar sx={{ mx: 1 }} src={message.author.avatar} />
                            <Box
                                sx={{
                                    borderRadius: "16px",
                                    px: 2,
                                    py: 1.5,
                                    maxWidth: "70%",
                                    boxShadow: 1,
                                    backgroundColor: isOwn ? "#d1e7dd" : "#fff",
                                    textAlign: isOwn ? "right" : "left",
                                    border: "1px solid #ddd",
                                }}
                            >
                                {chatData?.isGroup && !isOwn && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: "0.75rem",
                                            color: "#888",
                                            mb: 0.5,
                                        }}
                                    >
                                        {message.author?.name}
                                    </Typography>
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{ wordBreak: "break-word", fontWeight: 500, color: 'black', }}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: message.content }} />
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", mt: 0.5, color: "#999" }}
                                >
                                    <TimeAgo timestamp={message.created_At} />
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* 🧾 Input */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: "1px solid #eee",
                    position: "relative",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        component="input"
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        sx={{
                            flex: 1,
                            p: 1.5,
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            outline: "none",
                            fontSize: "1rem",
                        }}
                    />

                    {/* Emoji Button */}
                    <Box
                        component="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        sx={{
                            p: "6px 10px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "none",
                            fontSize: "1.2rem",
                        }}
                        aria-label="Open emoji picker"
                    >
                        😊
                    </Box>

                    {/* Send Button */}
                    <Box
                        component="button"
                        onClick={handleSendMessage}
                        sx={{
                            px: 2,
                            py: 1,
                            backgroundColor: "#007bff",
                            color: "#fff",
                            borderRadius: "10px",
                            cursor: "pointer",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                        }}
                        aria-label="Send message"
                    >
                        <SendIcon fontSize="small" />
                    </Box>
                </Box>

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "60px",
                            right: "20px",
                            zIndex: 10,
                        }}
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Box>
                )}
            </Box>
            {hasNewMessage && (
                <Box
                    onClick={() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        setHasNewMessage(false);
                    }}
                    sx={{
                        position: 'absolute',
                        bottom: 90,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#007bff',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: 2,
                        fontSize: '0.85rem',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <KeyboardArrowDownIcon fontSize="small" />
                    Tin nhắn mới
                </Box>
            )}

        </Box>
    );
}
