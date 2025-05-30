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
    ButtonGroup,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import { IChat, IPendingInvitationGroup } from '../../../../commom/type/chat.type';
import { getListChatService, getGroupInvitationReqService, patchGroupInvitationReqService } from '../../../../services/chatService';
import { useNavigate } from 'react-router-dom';
import { urlPrivatepPage } from '../../../../router/constants';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enumInvitationStatus } from '../../../../commom/type/chat.type';
const GroupInvationReq: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: GroupInvationReqs, isPending } = useQuery<IPendingInvitationGroup[]>({
        queryKey: ['group-invitation'],
        queryFn: getGroupInvitationReqService,
    });

    const handleGroupClick = (groupId: string) => {
        const url = urlPrivatepPage.MENU.GROUPS_INFO.replace(':groupId', groupId)
        navigate(url)
    };

    const { mutate: actionPatch, isPending: acceptPending } = useMutation({
        mutationFn: (data: {
            invitationId: string,
            status: enumInvitationStatus
        }) => patchGroupInvitationReqService(data),
        onSuccess: (_, friendId) => {
            // setFriendList(prev => prev.filter(friend => friend.id !== friendId));
            // dispatch(setNumberInvitation(numberNotification.invitation - 1));
            queryClient.invalidateQueries({ queryKey: ['listChat'] });
            queryClient.invalidateQueries({ queryKey: ['group-invitation'] });
        },
    });

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Danh sách nhóm
            </Typography>

            {isPending ? (
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : GroupInvationReqs && GroupInvationReqs.length > 0 ? (
                <List>
                    {GroupInvationReqs.map((invitation: IPendingInvitationGroup) => (
                        <ListItemButton key={invitation.id} onClick={() => handleGroupClick(invitation.id)}>
                            <ListItemAvatar>
                                <Badge
                                    badgeContent={invitation.chatGroup.members.length}
                                    color="primary"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar>
                                        <GroupIcon />
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>

                            <ListItemText
                                primary={invitation.chatGroup.name}
                                secondary={`Thành viên: ${invitation.chatGroup.members.length}`}
                            />

                            <ButtonGroup variant="contained" disableElevation>
                                <LoadingButton
                                    size="small"
                                    variant="outlined"
                                    // loading={isUnfriending}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        actionPatch({invitationId: invitation.id, status: enumInvitationStatus.REJECTED})
                                    }}
                                >
                                    <b>Từ chối</b>
                                </LoadingButton>
                                <LoadingButton
                                    size="small"
                                    variant="outlined"
                                    // loading={pendingAccept}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        actionPatch({invitationId: invitation.id, status: enumInvitationStatus.ACCEPTED})
                                    }}
                                >
                                    <b>Xác nhận</b>
                                </LoadingButton>
                            </ButtonGroup>
                        </ListItemButton>
                    ))}
                </List>
            ) : (
                <Typography>Không có nhóm nào.</Typography>
            )}
        </Box>
    );
};

export default GroupInvationReq;
