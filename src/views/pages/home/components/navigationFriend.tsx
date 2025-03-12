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
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { getListFriend, getListReqFriend, acceptedFriend, deleteFriend } from '../../../../services/friendService';
import { IDataFriendType, FriendStatus } from '../../../../commom/type/friend.type';
import { useAppSelector, useAppDispatch } from '../../../../hooks/reduxHook';
import { notification, setNumberInvitation, exceptOneAnnouncement } from '../../../../store/notificationSlice';
import { createChatService, GetListChatService } from '../../../../services/chatService';
import { useDemoRouter } from '@toolpad/core/internal';
import { IChat } from '../../../../commom/type/chat.type';
import type { Navigation, Router } from '@toolpad/core/AppProvider';
import { create } from 'domain';

interface NavigationFriendsProps {
  setOpentDialog: React.Dispatch<React.SetStateAction<boolean>>;
  value: number;
  router: Router
}

const getFriendStatusText = (friend: IDataFriendType, value: number) => {
  if (value === 0) {
    if (friend.status === FriendStatus.Pending) {
      return "Xác nhận";
    } else if (friend.status === FriendStatus.Accepted) {
      return "Bạn bè"
    }
  }

  if (value === 1) {
    if (friend.status === FriendStatus.Accepted) {
      return "Hủy kết bạn"
    }
  }
  return "";
};

export default function NavigationFriends(props: NavigationFriendsProps) {
  const { value, setOpentDialog, router } = props
  const [friendList, setFriendList] = useState<IDataFriendType[]>([]);
  const numberNotification = useAppSelector(notification)
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient();

  const { mutate: reqCreateChat } = useMutation({
    mutationFn: (userId: string) => {
      const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
      const existingChatIndex = listChat.findIndex(chatData => chatData.user.id === userId);
      if (existingChatIndex !== -1) {
        const existingChat = listChat[existingChatIndex];
        const updatedChatList = [existingChat, ...listChat.filter((_, index) => index !== existingChatIndex)];
        queryClient.setQueryData(['listChat'], updatedChatList);
        setOpentDialog(false);
        router.navigate(existingChat.id);
        throw new Error("Chat already exists");
      }

      return createChatService(userId);
    },
    onSuccess: (res) => {
      if (!res) return;
      const chatData: IChat = res.data;
      queryClient.setQueryData(['listChat'], (oldChats: IChat[] = []) => {
        return [chatData, ...oldChats]; // Đảm bảo oldChats luôn là mảng
      });
      setOpentDialog(false);
      router.navigate(chatData.id);
    },
  });

  const { mutate: ListFriend, isPending, } = useMutation({
    mutationFn: () => {
      return getListFriend()
    },
    onSuccess: (res) => {
      setFriendList(res.data)
    }
  })

  const { mutate: listReqFriend, } = useMutation({
    mutationFn: () => {
      return getListReqFriend()
    },
    onSuccess: (res) => {
      setFriendList(res.data);
    }
  })

  const { mutate: onAcceptRequest, isPending: pendingAccept } = useMutation({
    mutationFn: acceptedFriend,
    onSuccess: (_, friendId) => {
      setFriendList((prevFriends) => {
        const updatedFriends = [...prevFriends];
        const index = updatedFriends.findIndex(friend => friend.id === friendId);
        if (index !== -1) {
          updatedFriends[index] = { ...updatedFriends[index], status: FriendStatus.Accepted };
        }
        return updatedFriends;
      })
      dispatch(setNumberInvitation(numberNotification.invitation - 1))
    },
    onError: (error) => {
      console.error("Failed to accept friend request:", error);
    }
  });

  const { mutate: declineInvitation, } = useMutation({
    mutationFn: (friendId: string) => {
      return deleteFriend(friendId)
    },
    onSuccess: (res, friendId) => {
      setFriendList((prevFriends) =>
        prevFriends.filter(friend => friend.id !== friendId)
      );
      dispatch(setNumberInvitation(numberNotification.invitation - 1))
    },
  });

  const { mutate: unFriend, } = useMutation({
    mutationFn: (friendId: string) => {
      return deleteFriend(friendId)
    },
    onSuccess: (res, friendId) => {
      setFriendList((prevFriends) =>
        prevFriends.filter(friend => friend.id !== friendId)
      );
    },
  });

  const handleCreateChat = (userId: string) => {
    const listChat: IChat[] = queryClient.getQueryData(['listChat']) || []
    const existingChat = listChat.find(chat => chat.user.id === userId);

    if (existingChat) {
      const updatedList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
      queryClient.setQueryData(['listChat'], updatedList);
      router.navigate(`${existingChat.id}`)
    } else {
      reqCreateChat(userId);
    }
  }

  useEffect(() => {
    switch (value) {
      case 0:
        listReqFriend();
        break;
      case 1:
        ListFriend();
        break;
      default:
        break;
    }
  }, [value, numberNotification]);

  return (
    <Box >
      <CssBaseline />
      <List>
        {friendList.map((friend, index) => (
          <ListItem key={index} disablePadding
            sx={{ width: '100%' }}
            secondaryAction={
              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled button group"
              >
                <LoadingButton
                  size="small"
                  variant="outlined"
                  onClick={() => value === 0 ? onAcceptRequest(friend.id) : unFriend(friend.id)}
                //  loading={pendingMakeFriend}
                >
                  <b>{getFriendStatusText(friend, value)}</b>
                </LoadingButton>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => value === 0 ? declineInvitation(friend.id) : handleCreateChat(friend.user.id)}
                >
                  {value === 0 ? (<b>Từ chối</b>) : (<b>Nhắn tin</b>)}
                </Button>
              </ButtonGroup>
            }
          >
            <ListItemButton sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
            >
              <ListItemAvatar>
                <Avatar src={friend?.user?.avatar ?? ''}
                />
              </ListItemAvatar>
              <ListItemText primary={`${friend?.user?.account}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}