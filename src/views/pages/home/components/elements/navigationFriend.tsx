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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
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

interface FriendListItemProps {
  friend: IDataFriendType | IDataFriendReqType;
  value: number;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onChat: (id: string) => void;
  onUnfriend: (id: string) => void;
  loadingIds: string[];
}

function FriendListItem({ friend, value, onAccept, onDecline, onChat, onUnfriend, loadingIds }: FriendListItemProps) {
  const isLoading = loadingIds.includes(friend.id);
  const getFriendStatusText = () => {
    if (value === 0 && friend.status === FriendStatus.Pending) return 'Xác nhận';
    if (friend.status === FriendStatus.Accepted) return value === 1 ? 'Hủy kết bạn' : 'Bạn bè';
    return '';
  };
  const user = (friend as any).user;

  return (
    <ListItem key={friend.id} disablePadding sx={{ width: '100%' }}
      secondaryAction={
        <ButtonGroup disableElevation variant="contained">
          <LoadingButton
            size="small"
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); value === 0 ? onAccept(friend.id) : onUnfriend(friend.id); }}
            loading={isLoading}
          >
            <b>{getFriendStatusText()}</b>
          </LoadingButton>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); value === 0 ? onDecline(friend.id) : user && onChat(user.id); }}
          >
            <b>{value === 0 ? 'Từ chối' : 'Nhắn tin'}</b>
          </Button>
        </ButtonGroup>
      }
    >
      <ListItemButton sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemAvatar>
          <Avatar src={user?.avatar ?? ''} />
        </ListItemAvatar>
        <ListItemText primary={user?.name ?? 'Unknown'} />
      </ListItemButton>
    </ListItem>
  );
}

export default function NavigationFriends({ value, setOpentDialog, router }: NavigationFriendsProps) {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const numberNotification = useAppSelector(notification);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: friendRequestsData, isLoading: isLoadingRequests } = useFriendInvitations();
  const { data: friendsData, isLoading: isLoadingFriends } = useFriendList(value === 1);

  const friendList = value === 0 ? friendRequestsData ?? [] : friendsData ?? [];

  const addLoading = (id: string) => setLoadingIds(prev => [...prev, id]);
  const removeLoading = (id: string) => setLoadingIds(prev => prev.filter(lid => lid !== id));
  const showSnackbar = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  // --- Mutations ---
  const { mutateAsync: reqCreateChat } = useMutation({
    mutationFn: async (userId: string) => createChatService(userId),
  });

  const { mutateAsync: onAcceptRequest } = useMutation({
    mutationFn: acceptedFriend,
    onSuccess: (_, friendId) => {
      queryClient.setQueryData<IDataFriendReqType[]>(['friend-requests'], old => old?.filter(f => f.id !== friendId) ?? []);
      queryClient.setQueryData<IDataFriendType[]>(['friends'], old => {
        const accepted = friendList.find(f => f.id === friendId);
        if (accepted && accepted.status === FriendStatus.Pending) {
          return [...(old ?? []), { ...accepted, status: FriendStatus.Accepted } as IDataFriendType];
        }
        return old ?? [];
      });
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      showSnackbar('Chấp nhận lời mời thành công', 'success');
    },
    onError: () => showSnackbar('Chấp nhận lời mời thất bại', 'error')
  });

  const { mutateAsync: declineInvitation } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      queryClient.setQueryData<IDataFriendReqType[]>(['friend-requests'], old => old?.filter(f => f.id !== friendId) ?? []);
      dispatch(setFriendInvitation(numberNotification.friendInvitation - 1));
      showSnackbar('Từ chối lời mời thành công', 'success');
    },
    onError: () => showSnackbar('Từ chối lời mời thất bại', 'error')
  });

  const { mutateAsync: unFriend } = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, friendId) => {
      queryClient.setQueryData<IDataFriendType[]>(['friends'], old => old?.filter(f => f.id !== friendId) ?? []);
      showSnackbar('Hủy kết bạn thành công', 'success');
    },
    onError: () => showSnackbar('Hủy kết bạn thất bại', 'error')
  });

  // --- Handlers ---
  const handleCreateChat = async (userId: string) => {
    const listChat: IChat[] = queryClient.getQueryData(['listChat']) ?? [];
    const existingChat = listChat.find(chat => chat.user?.id === userId);
    if (existingChat) {
      queryClient.setQueryData(['listChat'], [existingChat, ...listChat.filter(c => c.user?.id !== userId)]);
      setOpentDialog(false);
      setTimeout(() => router.navigate(`${existingChat.id}`), 200);
    } else {
      addLoading(userId);
      try {
        const res = await reqCreateChat(userId);
        if (!res) return;
        const chatData: IChat = res.data;
        queryClient.setQueryData(['listChat'], (oldChats: IChat[] = []) => [chatData, ...oldChats]);
        setOpentDialog(false);
        setTimeout(() => router.navigate(chatData.id), 200);
        showSnackbar('Tạo chat thành công', 'success');
      } catch {
        showSnackbar('Tạo chat thất bại', 'error');
      } finally {
        removeLoading(userId);
      }
    }
  };

  const handleAccept = async (friendId: string) => {
    addLoading(friendId);
    try {
      await onAcceptRequest(friendId);
    } finally {
      removeLoading(friendId);
    }
  };

  const handleDecline = async (friendId: string) => {
    addLoading(friendId);
    try {
      await declineInvitation(friendId);
    } finally {
      removeLoading(friendId);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    addLoading(friendId);
    try {
      await unFriend(friendId);
    } finally {
      removeLoading(friendId);
    }
  };

  const isLoading = (value === 0 && isLoadingRequests) || (value === 1 && isLoadingFriends);

  return (
    <Box>
      <CssBaseline />
      {isLoading ? (
        <div>Loading...</div>
      ) : friendList.length > 0 ? (
        <List>
          {friendList.map(friend => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              value={value}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onChat={handleCreateChat}
              onUnfriend={handleUnfriend}
              loadingIds={loadingIds}
            />
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            fontWeight: 400,
            fontSize: '1rem',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {value === 0
            ? 'Không có lời mời kết bạn nào'
            : 'Không có ai trong danh sách bạn bè'}
        </Box>
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
