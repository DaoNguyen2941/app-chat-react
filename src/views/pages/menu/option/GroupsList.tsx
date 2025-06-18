import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Badge,
    ListItemButton,
    CircularProgress,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import { useQuery } from '@tanstack/react-query';
import { IChat } from '../../../../commom/type/chat.type';
import { getListChatService } from '../../../../services/chatService';
import { useNavigate } from 'react-router-dom';
import { urlPrivatepPage } from '../../../../router/constants';
import { useChatList } from '../../../../hooks/chat/useChatList';
const GroupList: React.FC = () => {
    const navigate = useNavigate();
    const [listGroup, setListGroup] = useState([])
    const { data, isPending } = useChatList()

    useEffect(() => {
        setListGroup(data?.filter((chat: IChat) => !!chat.chatGroup))
    }, [data])

    const handleGroupClick = (groupId: string) => {
        const url = urlPrivatepPage.MENU.GROUPS_INFO.replace(':groupId', groupId)
        navigate(url)
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Danh sách nhóm
            </Typography>

            {isPending ? (
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : listGroup && listGroup.length > 0 ? (
                <List>
                    {listGroup.map((chat: IChat) => (
                        <ListItemButton key={chat.id} onClick={() => handleGroupClick(chat.id)}>
                            <ListItemAvatar>
                                <Badge
                                    badgeContent={chat.chatGroup.members.length}
                                    color="primary"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar>
                                        <GroupIcon />
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>

                            <ListItemText
                                primary={chat.chatGroup.name}
                                secondary={`Thành viên: ${chat.chatGroup.members.length}`}
                            />

                            <IconButton
                                edge="end"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: navigate(`/chat/group/${chat.id}`);
                                }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </ListItemButton>
                    ))}
                </List>
            ) : (
                <Typography>Không có nhóm nào.</Typography>
            )}
        </Box>
    );
};

export default GroupList;
