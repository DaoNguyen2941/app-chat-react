import React, { useState } from 'react';
import {
  Box, Avatar, Typography, List, ListItemAvatar, ListItemText, ListItemButton,
  ButtonGroup,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import UserInfoDialog from '../../../components/UserInfoDialog';
import {  deleteFriend } from '../../../../services/friendService';
import { IDataFriendType } from '../../../../type/friend.type';
import TimeAgo from '../../home/components/elements/TimeAgo';
import LoadingButton from '@mui/lab/LoadingButton';
// import { IChat } from '../../../../type/chat.type';
// import { createChatService } from '../../../../services/chatService';
// import { useNavigate } from 'react-router-dom';
import { useFriendList } from '../../../../hooks/friends/useFriendList';
const FriendsList: React.FC = () => {

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const {data: friendData,isLoading,} = useFriendList(true)

  const { mutate: unFriend, isPending: isUnfriending } = useMutation({
    mutationFn: (friendId: string) => deleteFriend(friendId),
    onSuccess: (_, friendId) => {
      queryClient.setQueryData(['friends'], (old: IDataFriendType[]) =>
        old ? old.filter((f: IDataFriendType) => f.id !== friendId) : []
      );
    },
  });

  const handleClickFriend = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseDialog = () => {
    setSelectedUserId(null);
  };

  const friends: IDataFriendType[] = friendData || [];

  // const { mutate: reqCreateChat } = useMutation({
  //   mutationFn: async (userId: string) => {
  //     const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
  //     const existingChat = listChat.find(chat => chat.user.id === userId);
  //     if (existingChat) {
  //       const updatedChatList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
  //       queryClient.setQueryData(['listChat'], updatedChatList);
  //       // router.navigate(existingChat.id);
  //       navigate('/home', { state: { chatId: existingChat.id } });
  //       throw new Error('Chat already exists');
  //     }
  //     return createChatService(userId);
  //   },
  //   onSuccess: (res) => {
  //     if (!res) return;
  //     const chatData: IChat = res.data;
  //     queryClient.setQueryData(['listChat'], (oldChats: IChat[] = []) => [chatData, ...oldChats]);
  //     // router.navigate(chatData.id);
  //     navigate('/home', { state: { chatId: chatData.id } });
  //   },
  // });
  
  // const handleCreateChat = (userId: string) => {
  //   const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
  //   const existingChat = listChat.find(chat => chat.user.id === userId);

  //   if (existingChat) {
  //     const updatedList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
  //     queryClient.setQueryData(['listChat'], updatedList);
  //     // router.navigate(`${existingChat.id}`);
  //     navigate('/home', { state: { chatId: existingChat.id } });
  //   } else {
  //     reqCreateChat(userId);
  //   }
  // };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách bạn bè
      </Typography>

      {isLoading ? (
        <Typography>Đang tải...</Typography>
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItemButton
              key={friend.id}
              onClick={() => handleClickFriend(friend.user.id)}
            >
              <ListItemAvatar>
                <Avatar alt={friend.user.name} src={friend.user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={friend.user.name}
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: friend.isOnline ? green[500] : red[500],
                      fontWeight: 'bold',
                    }}
                  >
                    {friend.isOnline
                      ? 'Đang online'
                      : <TimeAgo timestamp={friend.lastSeen} />
                    }
                  </Typography>
                }
              />
              <ButtonGroup variant="contained" disableElevation>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  loading={isUnfriending}
                  onClick={(event) => {
                    event.stopPropagation();
                    unFriend(friend.id);
                  }}
                >
                  <b>Hủy kết bạn</b>
                </LoadingButton>
                {/* <LoadingButton
                  size="small"
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCreateChat(friend.user.id)
                  }}
                >
                  <b>Nhắn tin</b>
                </LoadingButton> */}
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

export default FriendsList;
