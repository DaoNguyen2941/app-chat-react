import React, { useState } from 'react';
import {
    Avatar, Box, Button, CircularProgress, Typography,
    List,ListItemAvatar, ListItemText, ListItemButton,
    IconButton,
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getChatGroupDataInfoService,
    deleterMemberGroupService,
    leaveGroupService,
    deleteGroupService,
} from '../../../../services/chatService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IChat, IChatGroupInfo } from '../../../../type/chat.type';
import { useAppSelector } from '../../../../hooks/reduxHook';
import { userData } from '../../../../store/userSlice';
import UserInfoDialog from '../../../components/UserInfoDialog';
import InviteMembersDialog from '../dialog/InviteMembersDialog';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const GroupDetailPage: React.FC = () => {
    const { groupId: groupId } = useParams();
    const dataUser = useAppSelector(userData);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const {
        data: groupInfo,
        isLoading,
        refetch,
    } = useQuery<IChatGroupInfo>({
        queryKey: ['groupInfo', groupId],
        queryFn: () => getChatGroupDataInfoService(groupId!),
        enabled: !!groupId,
    });

    const isManager = groupInfo?.manager.id === dataUser.id;

    const { mutate: leaveGroup } = useMutation({
        mutationFn: (groupId: string) => leaveGroupService(groupId),
        onSuccess: (_, groupId) => {
            queryClient.setQueryData<any>(['listChat'], (old: any[]) =>
                old.filter((chat: IChat) => chat.id !== groupId)
            );
        },
    });

    const { mutate: removeMember } = useMutation({
        mutationFn: (userId: string) => deleterMemberGroupService(groupId!, userId),
        onSuccess: (_, userId) => {
            queryClient.setQueryData(['groupInfo', groupId], (groupdata: IChatGroupInfo | undefined) => {
                if (!groupdata) return groupdata;

                return {
                    ...groupdata,
                    members: groupdata.members.filter((m) => m.id !== userId),
                };
            });

            queryClient.setQueryData(['listChat'], (old: any[]) =>
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

    const { mutate: disbandTheGroup } = useMutation({
        mutationFn: (groupId: string) => deleteGroupService(groupId),
        onSuccess: (_, groupId) => {
            queryClient.setQueryData<any>(['listChat'], (old: any[]) =>
                old.filter((chat: IChat) => chat.id !== groupId)
            );
        },
    });

    const handleKick = (userId: string) => {
        if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi nhóm?')) {
            removeMember(userId);
        }
    };

    const handleLeaveGroup = (groupId: string) => {
        if (window.confirm('Bạn có chắc muốn rời khỏi nhóm?')) {
            leaveGroup(groupId);
            navigate('/menu/groups');
        }
    };

    const handleDissolveGroup = (groupId: string) => {
        if (window.confirm('Bạn có chắc muốn giải tán nhóm này?')) {
            disbandTheGroup(groupId);
            navigate('/menu/groups');
        }
    };

    const handleInvite = () => {
        setInviteDialogOpen(true);
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
                                        <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                                            <Avatar
                                                src={member.avatar}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            {member.id === groupInfo.manager.id && (
                                                <VpnKeyIcon
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: -4,
                                                        right: -4,
                                                        width: 16,
                                                        height: 16,
                                                        color: '#fbc02d', // màu vàng đậm
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        boxShadow: 1,
                                                    }}
                                                />
                                            )}
                                        </Box>
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
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDissolveGroup(groupInfo.id)}
                                >
                                    Giải tán nhóm
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="warning" startIcon={<LogoutIcon />} onClick={() => handleLeaveGroup(groupInfo.id)}>
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

            {groupInfo && (
                <InviteMembersDialog
                    open={inviteDialogOpen}
                    onClose={() => setInviteDialogOpen(false)}
                    groupId={groupId!}
                    existingMemberIds={groupInfo.members.map(m => m.id)}
                />
            )}

        </Box>
    );
};

export default GroupDetailPage;
