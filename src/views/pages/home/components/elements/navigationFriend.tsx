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
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptedFriend,
  deleteFriend,
} from '../../../../../services/friendService';
import { createChatService } from '../../../../../services/chatService';

import { IDataFriendType, FriendStatus, IDataFriendReqType } from '../../../../../type/friend.type';
import { IChat } from '../../../../../type/chat.type';

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

export default function NavigationFriends({ value, setOpentDialog, router }: NavigationFriendsProps) {
  const [friendList, setFriendList] = useState<IDataFriendType[] | IDataFriendReqType[]>([]);
  const numberNotification = useAppSelector(notification);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: friendRequestsData, isLoading: isLoadingRequests } = useFriendInvitations();
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
      const existingChat = listChat.find(chat => chat.user && chat.user.id === userId);
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
      setTimeout(() => {
        router.navigate(chatData.id);
      }, 200);
    },
  });

  const { mutate: onAcceptRequest, isPending: pendingAccept } = useMutation({
    mutationFn: acceptedFriend,
    onSuccess: (_, friendId) => {
      // Cập nhật danh sách hiển thị local 
      setFriendList(prev => {
        const updated = [...prev];
        const index = updated.findIndex(f => f.id === friendId);
        if (index !== -1) {
          updated[index] = { ...updated[index], status: FriendStatus.Accepted };
        }
        return updated;
      });

      // Cập nhật thủ công cache danh sách lời mời
      queryClient.setQueryData<IDataFriendReqType[]>(['friend-requests'], old => {
        if (!old) return [];
        return old.filter(friend => friend.id !== friendId);
      });

      // Cập nhật thủ công cache danh sách bạn bè
      queryClient.setQueryData<IDataFriendType[]>(['friends'], old => {
        if (!old) return [];
        const foundFriend = old.find(f => f.id === friendId);
        if (foundFriend) return old;
        // Nếu chưa có, thêm mới
        const accepted = friendList.find(f => f.id === friendId);
        if (accepted && accepted.status === FriendStatus.Pending) {
          return [...old, { ...accepted, status: FriendStatus.Accepted } as IDataFriendType];
        }
        return old;
      });

      // Cập nhật số lượng thông báo
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
    },
  });

  const { mutate: declineInvitation } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      // Cập nhật UI local
      setFriendList(prev => prev.filter(friend => friend.id !== friendId));

      // Cập nhật cache lời mời
      queryClient.setQueryData<IDataFriendReqType[]>(['friend-requests'], old => {
        if (!old) return [];
        return old.filter(friend => friend.id !== friendId);
      });

      // Cập nhật số lượng thông báo
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
    },
  });


  const { mutate: unFriend } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      // Cập nhật UI local
      setFriendList(prev => prev.filter(friend => friend.id !== friendId));

      // Cập nhật cache bạn bè
      queryClient.setQueryData<IDataFriendType[]>(['friends'], old => {
        if (!old) return [];
        return old.filter(friend => friend.id !== friendId);
      });
    },
  });


  const handleCreateChat = (userId: string) => {
    const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];

    // Tìm chat đã tồn tại với userId (nếu có)
    const existingChat = listChat.find(chat => chat.user?.id === userId);

    if (existingChat?.id) {
      // Đưa chat này lên đầu danh sách
      const updatedList = [
        existingChat,
        ...listChat.filter(chat => chat.user?.id !== userId)
      ];
      queryClient.setQueryData(['listChat'], updatedList);

      setTimeout(() => {
        router.navigate(`${existingChat.id}`);
      }, 200);
    } else {
      // Không có chat, tạo mới
      reqCreateChat(userId);
    }
  };


  const isLoading = (value === 0 && isLoadingRequests) || (value === 1 && isLoadingFriends);

  return (
    <Box>
      <CssBaseline />
      {isLoading ? (
        <div>Loading...</div> //  thay bằng Skeleton hoặc CircularProgress
      ) : (
        <List>
          {friendList.map((friend) => (
            <ListItem key={friend.id} disablePadding sx={{ width: '100%' }}
              secondaryAction={
                <ButtonGroup disableElevation variant="contained">
                  <LoadingButton
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn click lan ra ngoài
                      value === 0
                        ? onAcceptRequest(friend.id)
                        : unFriend(friend.id);
                    }}
                    loading={pendingAccept}
                  >
                    <b>{getFriendStatusText(friend, value)}</b>
                  </LoadingButton>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      value === 0
                        ? declineInvitation(friend.id)
                        : handleCreateChat(friend.user.id);
                    }}
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
