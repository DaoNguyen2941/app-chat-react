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

import { IDataFriendType, FriendStatus } from '../../../../../commom/type/friend.type';
import { IChat } from '../../../../../commom/type/chat.type';

import { useAppSelector, useAppDispatch } from '../../../../../hooks/reduxHook';
import {
  notification,
  setNumberInvitation,
} from '../../../../../store/notificationSlice';

import type { Router } from '@toolpad/core/AppProvider';

interface NavigationFriendsProps {
  setOpentDialog: React.Dispatch<React.SetStateAction<boolean>>;
  value: number;
  router: Router;
}

const getFriendStatusText = (friend: IDataFriendType, value: number) => {
  if (value === 0 && friend.status === FriendStatus.Pending) {
    return 'Xác nhận';
  }
  if (friend.status === FriendStatus.Accepted) {
    return value === 1 ? 'Hủy kết bạn' : 'Bạn bè';
  }
  return '';
};

export default function NavigationFriends({ value, setOpentDialog, router }: NavigationFriendsProps) {
  const [friendList, setFriendList] = useState<IDataFriendType[]>([]);
  const numberNotification = useAppSelector(notification);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data: friendRequestsData,
    isLoading: isLoadingRequests,
  } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getListReqFriend,
    enabled: value === 0,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true, // 👉 vẫn refetch khi tab ẩn
  });

  const {
    data: friendsData,
    isLoading: isLoadingFriends,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getListFriend,
    enabled: value === 1,
  });

  useEffect(() => {
    if (value === 0 && friendRequestsData) {
      setFriendList(friendRequestsData.data);
    } else if (value === 1 && friendsData) {
      setFriendList(friendsData.data);
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
      dispatch(setNumberInvitation(numberNotification.invitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const { mutate: declineInvitation } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      setFriendList(prev => prev.filter(friend => friend.id !== friendId));
      dispatch(setNumberInvitation(numberNotification.invitation - 1));
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
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
    const existingChat = listChat.find(chat => chat.user.id === userId);

    if (existingChat) {
      const updatedList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
      queryClient.setQueryData(['listChat'], updatedList);
      router.navigate(`${existingChat.id}`);
    } else {
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
