import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import List from '@mui/material/List';
import { useDemoRouter } from '@toolpad/core/internal';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import { SearchUserService } from '../../../../../services/userService';
import { useDebounce } from '../../../../../hooks/debouncehook';
import { QueryClient, useQueryClient, useMutation } from '@tanstack/react-query';
import { ISearchUser, IFriendStatus } from '../../../../../type/user.type';
import type { Navigation, Router } from '@toolpad/core/AppProvider';
import { IChat } from '../../../../../type/chat.type';
import { makeFriendService, acceptedFriend, deleteFriend } from '../../../../../services/friendService';
import { useAppSelector } from '../../../../../hooks/reduxHook';
import { userData } from '../../../../../store/userSlice';
import { createChatService } from '../../../../../services/chatService';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        width: '800px', // Đặt chiều rộng
        maxWidth: '60%', // Đặt giới hạn tối đa chiều rộng
        height: '600px', // Đặt chiều cao
        maxHeight: '90%', // Đặt giới hạn tối đa chiều cao
    },
}));

interface ToolbarActionsSearchProps {
    router: Router;
}

const getFriendStatusText = (user: ISearchUser, dataUser: { id: string, account: string }) => {
    if (!user.statusFriend) return "Kết bạn";

    const { status, senderId } = user.statusFriend;

    if (status === "Pending") {
        return senderId === dataUser.id ? "Hủy lời mời" : "Xác nhận";
    }

    if (status === "Accepted") {
        return "Bạn bè";
    }

    return "";
};

const AddFriend: React.FC<ToolbarActionsSearchProps> = ({ router }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<ISearchUser[]>([]);
    const debouncedQuery = useDebounce(search, 500);
    const dataUser = useAppSelector(userData)
    const queryClient = useQueryClient();

    const { mutate: makeFriend, isPending: pendingMakeFriend, isSuccess: makeFriendSuccess, } = useMutation({
        mutationFn: (userId: string) => {
            return makeFriendService(userId);
        },
        onSuccess: (res) => {
            const dataFriendStatus: IFriendStatus = {
                id: res.data.id,
                status: res.data.status,
                senderId: dataUser.id
            }
            setUsers((prevUsers) =>
                prevUsers.map(user =>
                    user.id === res.data.receiver.id
                        ? { ...user, statusFriend: dataFriendStatus }
                        : user
                )
            );
        }
    });

    const { mutate: onAcceptRequest, isPending: pendingAccept, isSuccess: AcceptSuccess, } = useMutation({
        mutationFn: (friendId: string) => {
            return acceptedFriend(friendId);
        },
        onSuccess: (res, friendId) => {
            setUsers((prevUsers) =>
                prevUsers.map(user => {
                    if (user.statusFriend?.id === friendId) {
                        return {
                            ...user,
                            statusFriend: user.statusFriend
                                ? { ...user.statusFriend, status: "Accepted" }
                                : { id: friendId, senderId: user.id, status: "Accepted" }
                        } as ISearchUser; // Ép kiểu rõ ràng
                    }
                    return user;
                })
            );
        },

    });

    const { mutate: cancelInvitation, isPending: pendingUnfriend, isSuccess } = useMutation({
        mutationFn: (friendId: string) => {
            return deleteFriend(friendId);
        },
        onSuccess: (res, friendId) => {
            setUsers((prevUsers) =>
                prevUsers.map(user =>
                    user.statusFriend?.id === friendId ? { ...user, statusFriend: null } : user
                )
            );
        }
    });

    const { mutate: reqCreateChat } = useMutation({
        mutationFn: async (userId: string) => {
            const listChat: IChat[] = queryClient.getQueryData(['listChat']) || [];
            const existingChat = listChat.find(chat => chat.user && chat.user.id === userId);
            if (existingChat) {
                const updatedChatList = [existingChat, ...listChat.filter(chat => chat.user.id !== userId)];
                queryClient.setQueryData(['listChat'], updatedChatList);
                setOpen(false);
                router.navigate(existingChat.id);
                throw new Error('Chat already exists');
            }

            return createChatService(userId);
        },
        onSuccess: (res) => {
            if (!res) return;
            const chatData: IChat = res.data;
            queryClient.setQueryData(['listChat'], (oldChats: IChat[] = []) => [chatData, ...oldChats]);
            setOpen(false);
            setTimeout(() => {
                router.navigate(chatData.id);
            }, 200);
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


    const { mutate: searcUser, isPending: pendingShearch, isError: searchUserError, isSuccess: searchSuccess } = useMutation({
        mutationFn: (keyword: string) => {
            return SearchUserService(keyword.trim());
        },
        onSuccess: (res) => {
            setUsers(res.data)
        }
    });

    React.useEffect(() => {
        if (debouncedQuery) {
            searcUser(debouncedQuery);
        } else {
            setUsers([]);
        }
    }, [debouncedQuery]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSearch('')
    };

    const handleFriendAction = (user: ISearchUser, dataUser: { id: string, account: string }) => {
        if (!user.statusFriend) {
            makeFriend(user.id); // Gửi lời mời kết bạn
        } else if (user.statusFriend.status === "Pending") {
            if (user.statusFriend.senderId === dataUser.id) {
                cancelInvitation(user.statusFriend.id); // Hủy lời mời kết bạn
            } else {
                onAcceptRequest(user.statusFriend.id); // Xác nhận lời mời kết bạn
            }
        }
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen} >
                <SearchIcon />
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Thêm bạn
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Tooltip title="Search" enterDelay={1000}>
                        <IconButton
                            type="button"
                            aria-label="search"
                            sx={{
                                display: { xs: 'inline', md: 'none' },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton type="button" aria-label="search" size="small">
                                        <PersonSearchIcon />
                                    </IconButton>
                                ),
                                sx: { pr: 0.5 },
                            },
                        }}
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'inline-block'
                            },
                            mr: 1,
                            flex: 1,
                        }}
                    />
                    {pendingShearch ? (
                        <Typography>Loading...</Typography>
                    ) : searchUserError ? (
                        <Typography color="error">{searchUserError}</Typography>
                    ) : (
                        <List>
                            {users.map(user => (
                                <ListItem key={user.id} disablePadding
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
                                                onClick={() => handleFriendAction(user, dataUser)}
                                                loading={pendingMakeFriend}
                                                disabled={user.statusFriend?.status === 'Accepted' ? true : false}
                                            >
                                                <b>{getFriendStatusText(user, dataUser)}</b>
                                            </LoadingButton>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCreateChat(user.id)}
                                            >
                                                {/* <ForumIcon /> */}
                                                <b>Nhắn tin</b>
                                            </Button>
                                        </ButtonGroup>
                                    }
                                >
                                    <ListItemButton sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar ?? ''}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={`${user.name}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                {/* <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Save changes
                    </Button>
                </DialogActions> */}
            </BootstrapDialog>
        </React.Fragment >
    );
}

export default AddFriend