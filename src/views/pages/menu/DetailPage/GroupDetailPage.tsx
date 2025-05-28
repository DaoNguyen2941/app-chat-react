import React, { useEffect, useState } from 'react';
import {
    Avatar, Box, Button, CircularProgress, Typography,
    List, ListItem, ListItemAvatar, ListItemText, ListItemButton,
    IconButton, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatGroupDataService, deleterMemberGroupService } from '../../../../services/chatService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IChatGroupInfo } from '../../../../commom/type/chat.type';
import { useAppSelector } from '../../../../hooks/reduxHook';
import { userData } from '../../../../store/userSlice';
import UserInfoDialog from '../../../components/UserInfoDialog';

const GroupDetailPage: React.FC = () => {
    const { groupId: groupId } = useParams();
    const dataUser = useAppSelector(userData);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const {
        data: groupInfo,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['groupInfo', groupId],
        queryFn: () => getChatGroupDataService(groupId!),
        enabled: !!groupId,
    });

    const isManager = groupInfo?.manager.id === dataUser.id;

    const { mutate: removeMember } = useMutation({
        mutationFn: (userId: string) => deleterMemberGroupService(groupId!, userId),
        onSuccess: (_, userId) => {
            queryClient.setQueryData<any>(['listChat'], (old: any[]) =>
                old?.map(chat =>
                    chat.id === groupId
                        ? {
                            ...chat,
                            chatGroup: {
                                ...chat.chatGroup,
                                members: chat.chatGroup.members.filter((m: any) => m.id !== userId),
                            },
                        }
                        : chat
                )
            );
        },
    });

    const handleKick = (userId: string) => {
        if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi nhóm?')) {
            removeMember(userId);
        }
    };

    const handleLeaveGroup = () => {
        if (window.confirm('Bạn có chắc muốn rời khỏi nhóm?')) {
            removeMember(dataUser.id);
            navigate('/menu/groups');
        }
    };

    const handleDissolveGroup = () => {
        // TODO: Gọi API giải tán nhóm
        alert('Chức năng giải tán nhóm đang được phát triển');
    };

    const handleInvite = () => {
        // TODO: Mở dialog mời người
        alert('Chức năng mời thành viên đang được phát triển');
    };

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {isLoading || !groupInfo ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : (
                <>
                    {/* --- Khu vực 1: Thông tin nhóm --- */}
                    <Box sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 80, height: 80 }} />
                            <Box>
                                <Typography variant="h5">{groupInfo.name}</Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Quản trị viên: {groupInfo.manager.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* --- Khu vực 2: Danh sách thành viên (cuộn nếu dài) --- */}
                    <Box sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        mb: 2,
                        pr: 1, // tránh scroll bar đè lên nội dung
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Thành viên ({groupInfo.members.length})
                        </Typography>
                        <List>
                            {groupInfo.members.map((member) => (
                                <ListItemButton key={member.id} onClick={() => setSelectedUserId(member.id)}>
                                    <ListItemAvatar>
                                        <Avatar src={member.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={member.id === groupInfo.manager.id ? 'Quản trị viên' : 'Thành viên'}
                                    />
                                    {isManager && member.id !== dataUser.id && member.id !== groupInfo.manager.id && (
                                        <IconButton edge="end" color="error" onClick={(e) => {
                                            e.stopPropagation();
                                            handleKick(member.id);
                                        }}>
                                            <PersonOffIcon />
                                        </IconButton>
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>

                    {/* --- Khu vực 3: Các nút thao tác --- */}
                    <Box sx={{
                        borderTop: '1px solid #ddd',
                        pt: 2,
                        mt: 'auto',
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        {isManager ? (
                            <>
                                <Button variant="outlined" startIcon={<GroupAddIcon />} onClick={handleInvite}>
                                    Mời thành viên
                                </Button>
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDissolveGroup}>
                                    Giải tán nhóm
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="warning" startIcon={<LogoutIcon />} onClick={handleLeaveGroup}>
                                Thoát nhóm
                            </Button>
                        )}
                    </Box>
                </>
            )}

            {selectedUserId && (
                <UserInfoDialog
                    open={!!selectedUserId}
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </Box>
    );
};

export default GroupDetailPage;
