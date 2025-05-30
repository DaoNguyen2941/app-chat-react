// HomeLayout.tsx
import * as React from 'react';
import { AppProvider, type Session, type Navigation } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import { createTheme, styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { ListItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHook';
import { connectSocket, disconnectSocket } from '../../../../store/socketSlice';
import { userData } from '../../../../store/userSlice';
import { useSetToken } from '../../../../hooks/authHook';
import { setAuth } from '../../../../store/authSlice';
import { deleteUserData } from '../../../../store/userSlice';

import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import { getListChatService } from '../../../../services/chatService';
import { logOutService } from '../../../../services/authService';

import ChatPopoverAction from '../components/elements/ChatPopoverAction';
import TimeAgo from '../components/elements/TimeAgo';
import AddFriend from '../components/Dialog/DialogAddFriend';
import FriendFunction from '../components/Dialog/DialogFriend';
import DialogCreateGroup from '../components/Dialog/DialogCreateGroup';

import { urlPublicPage } from '../../../../router/constants';
import { IChat } from '../../../../commom/type/chat.type';
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    border: '2px solid white',
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
}));

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function SidebarFooterAccount({ mini }: SidebarFooterProps) {
  // Bạn có thể customize footer account thêm
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}></Typography>
      <MenuList>
        <MenuItem
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            columnGap: 2,
          }}
        >
          <ListItem>
            <SettingsIcon />
          </ListItem>
          <ListItemText
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
            primary="Thiết lập tài khoản"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </MenuList>
      <Divider />
      {/* Bạn có thể thêm nút đăng xuất ở đây nếu muốn */}
    </Stack>
  );
}

const ToolbarActionsSearch: React.FC<{ router: any }> = ({ router }) => {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/settings'); // hoặc url bạn muốn điều hướng tới trang setting
  };

  return (
    <Stack direction="row" spacing={1}>
      <AddFriend router={router} />
      <FriendFunction router={router} />
      <DialogCreateGroup />
      <IconButton onClick={goToSettings}>
        <SettingsIcon />
      </IconButton>
      {/* Nếu có ThemeSwitcher thì thêm vào đây */}
    </Stack>
  );
};


interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const dispatch = useAppDispatch();
  const dataUser = useAppSelector(userData);
  const navigate = useNavigate();
  const setToken = useSetToken;
  const queryClient = new QueryClient();

  const router = useDemoRouter('/');

  // Lấy danh sách chat
  const { data: listChat } = useQuery({
    queryKey: ['listChat'],
    queryFn: getListChatService,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });

  // Kết nối socket khi mount
  React.useEffect(() => {
    dispatch(connectSocket());
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  // Quản lý session user
  const [session, setSession] = React.useState<Session | null>(
    dataUser?.name
      ? {
        user: {
          name: dataUser.name,
          image: dataUser.avatar,
        },
      }
      : null,
  );

  // Đăng xuất
  const { mutate: logOut } = useMutation({
    mutationFn: logOutService,
    onSuccess: () => {
      setSession(null);
      setToken('');
      dispatch(setAuth({ isAuth: false }));
      dispatch(disconnectSocket());
      dispatch(deleteUserData());
      queryClient.clear();
      navigate(urlPublicPage.LOGIN);
    },
  });

  const authentication = React.useMemo(
    () => ({
      signIn: () => {
        setSession({
          user: {
            name: dataUser.name,
            image: dataUser.avatar,
          },
        });
      },

      signOut: () => {
        logOut();
      },
    }),
    [dataUser, logOut],
  );

  // Tạo navigation list từ danh sách chat
  const listChats = listChat?.map((chat: IChat) => ({
    segment: chat.IsGroup ? `group/${chat.id}` : `${chat?.id}`,
    title: (
      <div>
        <p>{chat.IsGroup ? chat?.chatGroup.name : chat?.user.name}</p>
        {chat.lastSeen ? (<TimeAgo timestamp={chat.lastSeen} />) : null}
      </div>
    ),
    icon: (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{ '& .MuiBadge-dot': { backgroundColor: chat.status === 'online' ? '#44b700' : '#555' } }}
      >
        {chat.IsGroup ? (
          <AvatarGroup max={3} spacing={24}>
            {chat.chatGroup.members.map((m: { avatar: string }) => <Avatar key={m.avatar} alt="" src={m.avatar} />)}
          </AvatarGroup>
        ) : (
          <Avatar alt={chat.user.name} src={chat.user.avatar} />
        )}
      </StyledBadge>
    ),
    action: chat.unreadCount > 0 ? <Chip label={chat.unreadCount} color="error" size="small" />
      : <ChatPopoverAction chatId={chat.id} isGroup={chat.IsGroup} router={router} />,
  }));

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={listChats}
      router={router}
      theme={demoTheme}
      branding={{ logo: null, title: 'ViVUChat' }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => <ToolbarActionsSearch router={router} />,
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
