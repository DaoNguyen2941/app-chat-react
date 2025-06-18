import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getListFriend,
  getListReqFriend,
  acceptedFriend,
  deleteFriend,
} from '../../../../../services/friendService';
import { createChatService } from '../../../../../services/chatService';

import { IDataFriendType, FriendStatus, IDataFriendReqType } from '../../../../../commom/type/friend.type';
import { IChat } from '../../../../../commom/type/chat.type';

import { useAppSelector, useAppDispatch } from '../../../../../hooks/reduxHook';
import {
  notification,
  setFriendInvitation,
} from '../../../../../store/notificationSlice';

import type { Router } from '@toolpad/core/AppProvider';
import { useFriendInvitations } from '../../../../../hooks/friends/useFriendInvitations';
import { useFriendList } from '../../../../../hooks/friends/useFriendList';

interface NavigationFriendsProps {
  setOpentDialog: React.Dispatch<React.SetStateAction<boolean>>;
  value: number;
  router: Router;
  open: boolean
}

const getFriendStatusText = (friend: IDataFriendType | IDataFriendReqType, value: number) => {
  if (value === 0 && friend.status === FriendStatus.Pending) {
    return 'Xác nhận';
  }
  if (friend.status === FriendStatus.Accepted) {
    return value === 1 ? 'Hủy kết bạn' : 'Bạn bè';
  }
  return '';
};

export default function NavigationFriends({ value, setOpentDialog, router, open }: NavigationFriendsProps) {
  const [friendList, setFriendList] = useState<IDataFriendType[] | IDataFriendReqType[]>([]);
  const numberNotification = useAppSelector(notification);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: friendRequestsData, isLoading: isLoadingRequests, error } = useFriendInvitations();
  const { data: friendsData, isLoading: isLoadingFriends } = useFriendList(value === 1);


  useEffect(() => {
    if (value === 0 && friendRequestsData) {
      setFriendList(friendRequestsData);
    } else if (value === 1 && friendsData) {
      setFriendList(friendsData);
    }
  }, [value, friendRequestsData, friendsData]);

  const { mutate: reqCreateChat } = useMutation({
    mutationFn: async (userId: string) => {
      const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
      const existingChat = listChat.find(chat => chat.user.id === userId);
      if (existingChat) {
        const updatedChatList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
        queryClient.setQueryData(['listChat'], updatedChatList);
        setOpentDialog(false);
        router.navigate(existingChat.id);
        throw new Error('Chat already exists');
      }

      return createChatService(userId);
    },
    onSuccess: (res) => {
      if (!res) return;
      const chatData: IChat = res.data;
      queryClient.setQueryData(['listChat'], (oldChats: IChat[] = []) => [chatData, ...oldChats]);
      setOpentDialog(false);
      router.navigate(chatData.id);
    },
  });

  const { mutate: onAcceptRequest, isPending: pendingAccept } = useMutation({
    mutationFn: acceptedFriend,
    onSuccess: (_, friendId) => {
      setFriendList(prev => {
        const updated = [...prev];
        const index = updated.findIndex(f => f.id === friendId);
        if (index !== -1) {
          updated[index] = { ...updated[index], status: FriendStatus.Accepted };
        }
        return updated;
      });
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const { mutate: declineInvitation } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      setFriendList(prev => prev.filter(friend => friend.id !== friendId));
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
  });

  const { mutate: unFriend } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      setFriendList(prev => prev.filter(friend => friend.id !== friendId));
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const handleCreateChat = (userId: string) => {
    const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
    const existingChat = listChat.find(chat => chat.user && chat.user.id === userId);

    if (existingChat) {
      console.log(existingChat);
      const updatedList = [existingChat, ...listChat.filter(chat => chat.user && chat.user.id !== userId)];
      queryClient.setQueryData(['listChat'], updatedList);
      router.navigate(`${existingChat.id}`);
    } else {
      console.log(false);
      
      reqCreateChat(userId);
    }
  };

  const isLoading = (value === 0 && isLoadingRequests) || (value === 1 && isLoadingFriends);

  return (
    <Box>
      <CssBaseline />
      {isLoading ? (
        <div>Loading...</div> // Bạn có thể thay bằng Skeleton hoặc CircularProgress
      ) : (
        <List>
          {friendList.map((friend) => (
            <ListItem key={friend.id} disablePadding sx={{ width: '100%' }}
              secondaryAction={
                <ButtonGroup disableElevation variant="contained">
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      value === 0
                        ? onAcceptRequest(friend.id)
                        : unFriend(friend.id)
                    }
                    loading={pendingAccept}
                  >
                    <b>{getFriendStatusText(friend, value)}</b>
                  </LoadingButton>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      value === 0
                        ? declineInvitation(friend.id)
                        : handleCreateChat(friend.user.id)
                    }
                  >
                    <b>{value === 0 ? 'Từ chối' : 'Nhắn tin'}</b>
                  </Button>
                </ButtonGroup>
              }
            >
              <ListItemButton sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar src={friend.user.avatar ?? ''} />
                </ListItemAvatar>
                <ListItemText primary={friend.user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
