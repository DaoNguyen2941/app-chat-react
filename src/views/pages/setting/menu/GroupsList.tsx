import React, { useState } from 'react';
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
import GroupInfoDialog from '../../../components/GroupInfoDialog';
import { getListChatGroupService } from '../../../../services/chatService';
import { useQuery } from '@tanstack/react-query';
import { IChat } from '../../../../commom/type/chat.type';
import { useQueryClient } from '@tanstack/react-query';
import { getListChatService } from '../../../../services/chatService';
const GroupList: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

const { data: listGroup,isPending } = useQuery<IChat[]>({
  queryKey: ['listChat'],
  queryFn: getListChatService,
  select: (data) => data.filter(chat => !!chat.chatGroup),
});
    // const {
    //     data: listGroup,
    //     isLoading,
    //     isError,
    // } = useQuery({
    //     queryKey: ['group-chat'],
    //     queryFn: getListChatGroupService,
    // });

    const handleGroupClick = (group: IChat) => {
        setSelectedGroupId(group.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedGroupId(null);
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
                        <ListItemButton key={chat.id} onClick={() => handleGroupClick(chat)}>
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

            {selectedGroupId && (
                <GroupInfoDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    groupId={selectedGroupId}
                />
            )}
        </Box>
    );
};

export default GroupList;
