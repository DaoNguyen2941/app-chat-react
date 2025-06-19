import React, { useState } from 'react';
import {
  Box, Avatar, Typography, List, ListItemAvatar, ListItemText, ListItemButton,
  ButtonGroup,
} from '@mui/material';
import UserInfoDialog from '../../../components/UserInfoDialog'; 
import {  deleteFriend } from '../../../../services/friendService';
import {  IDataFriendReqType } from '../../../../type/friend.type';
import LoadingButton from '@mui/lab/LoadingButton';
import { acceptedFriend } from '../../../../services/friendService';
import { useAppSelector, useAppDispatch } from '../../../../hooks/reduxHook';
import {
  notification,
  setFriendInvitation,
} from '../../../../store/notificationSlice';
import { useQueryClient,useMutation } from '@tanstack/react-query';

import { useFriendInvitations } from '../../../../hooks/friends/useFriendInvitations';
const FriendRequest: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const numberNotification = useAppSelector(notification);
  const { data: friendData, isLoading, error } = useFriendInvitations();


  const handleClickFriend = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseDialog = () => {
    setSelectedUserId(null);
  };

  const { mutate: onAcceptRequest, isPending: pendingAccept } = useMutation({
    mutationFn: acceptedFriend,
    onSuccess: (_, friendId) => {
      // setFriendList(prev => {
      //   const updated = [...prev];
      //   const index = updated.findIndex(f => f.id === friendId);
      //   if (index !== -1) {
      //     updated[index] = { ...updated[index], status: FriendStatus.Accepted };
      //   }
      //   return updated;
      // });
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const { mutate: declineInvitation, isPending: isUnfriending } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      // setFriendList(prev => prev.filter(friend => friend.id !== friendId));
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
  });


  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách yêu cầu kết bạn
      </Typography>

      {isLoading ? (
        <Typography>Đang tải...</Typography>
      ) : (
        <List>
          {(friendData ?? []).map((friend: IDataFriendReqType  ) => (
            <ListItemButton
              key={friend.id}
              onClick={() => handleClickFriend(friend.user.id)}
            >
              <ListItemAvatar>
                <Avatar alt={friend.user.name} src={friend.user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={friend.user.name}
                // secondary={
                //   <Typography
                //     variant="body2"
                //     sx={{
                //       color: friend.isOnline ? green[500] : red[500],
                //       fontWeight: 'bold',
                //     }}
                //   >
                //     {friend.isOnline
                //       ? 'Đang online'
                //       : <TimeAgo timestamp={friend.lastSeen} />
                //     }
                //   </Typography>
                // }
              />
              <ButtonGroup variant="contained" disableElevation>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  loading={isUnfriending}
                  onClick={(event) => {
                    event.stopPropagation();
                    declineInvitation(friend.id)
                  }}
                >
                  <b>Từ chối</b>
                </LoadingButton>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  loading={pendingAccept}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAcceptRequest(friend.id)
                  }}
                >
                  <b>Xác nhận</b>
                </LoadingButton>
              </ButtonGroup>
            </ListItemButton>
          ))}
        </List>
      )}

      {selectedUserId && (
        <UserInfoDialog
          open={Boolean(selectedUserId)}
          onClose={handleCloseDialog}
          userId={selectedUserId}
        />
      )}
    </Box>
  );
};

export default FriendRequest;
