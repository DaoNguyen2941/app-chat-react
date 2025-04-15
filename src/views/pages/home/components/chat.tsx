import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import SendIcon from '@mui/icons-material/Send';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getChatDataService, getVirtualChatDataService, readMessageService } from '../../../../services/chatService';
import { IChatData, Imessage, IChat } from '../../../../commom/type/chat.type';
import { postMessageService } from '../../../../services/chatService';
import { setChatOpent } from '../../../../store/socketSlice';
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import TimeAgo from './elements/TimeAgo';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useAppDispatch } from '../../../../hooks/reduxHook';
import { useAppSelector } from '../../../../hooks/reduxHook';
import { userData } from '../../../../store/userSlice';

export default function Chat({ chatId }: { chatId: string }) {    
    const dispatch = useAppDispatch()
    const dataUser = useAppSelector(userData)
    const queryClient = useQueryClient();
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null); // Ref cho ô nhập tin nhắn


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        if (inputRef.current) {
            const input = inputRef.current;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;

            // Chèn emoji vào vị trí con trỏ
            const newMessage = message.slice(0, start) + emojiData.emoji + message.slice(end);
            setMessage(newMessage);

            // Đặt lại con trỏ ngay sau emoji vừa chèn
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
            }, 0);
        }
    };

    const { data: chatData } = useQuery<IChatData, Error>({
        queryKey: ['chatData', chatId.slice(1)],
        queryFn: async () => {
            const response = await getChatDataService(chatId);
            return response.data;
        },
    });

    const { mutate: readMessage } = useMutation({
        mutationFn: () => readMessageService(chatId),
        onSuccess: () => {
            const idChat = chatId.slice(1)
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
        let presentChat
        if (chatId.includes('group')) {
            dispatch(setChatOpent(chatId.slice(7)));
            presentChat = listChat.find(chat => chat.id === chatId.slice(7));
        } else {
            dispatch(setChatOpent(chatId.slice(1)));
            presentChat = listChat.find(chat => chat.id === chatId.slice(1));
        }
        if (presentChat?.unreadCount && presentChat.unreadCount > 0) {
            readMessage()
        }
    }, [chatId]);

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: (keyword: string) => {
            return postMessageService(chatId, keyword)
        },
        onSuccess(res) {
            queryClient.setQueryData(["chatData", chatId.slice(1)], (oldData: IChatData) => ({
                ...oldData,
                message: [...(oldData?.message || []), res.data],
            }));
        },
    })

    const handleSendMessage = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
        if (showEmojiPicker) {
            setShowEmojiPicker(false)
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage()
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData?.message]); // Mỗi khi tin nhắn thay đổi, tự động cuộn

    return (
        <Box
            sx={{
                py: 2,
                px: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderLeft: '1px solid #ddd',
                borderRight: '1px solid #ddd',
            }}
        >
            {/* Header */}
            <Typography
                variant="h6"
                component="div"
                sx={{ pb: 2, borderBottom: '1px solid #ddd', textAlign: 'center' }}
            >
                {/* Chat with  {pathname} */}
                <ListItem>
                    <ListItemAvatar>
                        {chatData?.isGroup ? (
                            <AvatarGroup max={3}  spacing="small">
                                {chatData?.members?.map((m: { avatar: string }) =>
                                    <Avatar alt="" src={m.avatar} />
                                )}
                            </AvatarGroup>
                        ) : (
                            <Avatar src={chatData?.user?.avatar} />
                        )}
                    </ListItemAvatar>
                    <ListItemText
                        primary={chatData?.user?.name || chatData?.name}
                    //   secondary="Jan 9, 2014"
                    />
                </ListItem>
            </Typography>

            {/* Messages List */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    my: 2,
                    p: 2,
                    borderRadius: '8px',
                    // boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
            >
                {chatData?.message?.map((message) => (
                    <Box
                        key={message?.id}
                        sx={{
                            display: 'flex',
                            flexDirection: message.author?.id === dataUser.id ? 'row-reverse' : 'row',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Avatar sx={{ mx: 1 }} src={message.author.avatar} />
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: '10px',
                                backgroundColor: message?.author?.id === chatData?.user?.id ? '#f8d7da' : '#d1e7dd',
                                maxWidth: '70%',
                            }}
                        >
                            <Typography variant="body2"
                                // sx={{ fontWeight: 'bold' }}
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: message?.author?.id === chatData?.user?.id ? 'left' : 'right ',
                                    display: 'block'
                                }}
                            >
                                {message.author?.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    wordBreak: 'break-word',
                                    textAlign: message?.author?.id === chatData?.user?.id ? 'left' : 'right ',
                                }}
                            >
                                {message.content}
                            </Typography>
                            <Typography variant="caption"
                                sx={{
                                    display: 'block',
                                    textAlign: message?.author?.id === chatData?.user?.id ? 'left' : 'right ',

                                }}>
                                <TimeAgo timestamp={message.created_At} />
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Box */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                {/* Ô nhập tin nhắn */}
                <Box
                    component="input"
                    ref={inputRef} // Gán ref
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    sx={{
                        flex: 1,
                        p: 1,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "1rem",
                    }}
                />

                {/* Nút mở emoji picker */}
                <Box
                    component="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    sx={{
                        ml: 2,
                        px: 2,
                        py: 1,
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    😊
                </Box>

                {/* Emoji picker */}
                {showEmojiPicker && (
                    <Box sx={{ position: "absolute", bottom: "50px", right: "10px" }}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </Box>
                )}

                {/* Nút gửi tin nhắn */}
                <Box
                    component="button"
                    onClick={handleSendMessage}
                    sx={{
                        ml: 2,
                        px: 3,
                        py: 1,
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "none",
                        "&:hover": { backgroundColor: "#0056b3" },
                    }}
                >
                    <SendIcon />
                </Box>
            </Box>
        </Box >
    );
}