import * as React from 'react';
import { AppProvider, type Session, type Navigation } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Chat from './components/chat';
import { createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AddFriend from './components/Dialog/DialogAddFriend';
import { ThemeSwitcher, } from '@toolpad/core/DashboardLayout';
import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import { getListChatService } from '../../../services/chatService';
import Divider from '@mui/material/Divider';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { useState, useEffect } from 'react';
import { IChat } from '../../../commom/type/chat.type';
import WelCome from '../../components/welCome';
import { useAppDispatch } from '../../../hooks/reduxHook';
import { userData } from '../../../store/userSlice';
import { useAppSelector } from '../../../hooks/reduxHook';
import { Link, useNavigate } from 'react-router-dom';
import AvatarGroup from '@mui/material/AvatarGroup';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
  AccountPreviewProps,
} from '@toolpad/core/Account';
import type { Router } from '@toolpad/core/AppProvider';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { ListItem } from '@mui/material';
import { connectSocket, disconnectSocket } from "../../../store/socketSlice";
import FriendFunction from './components/Dialog/DialogFriend';
import { useSetToken } from '../../../hooks/authHook';
import { setAuth } from '../../../store/authSlice';
import { deleteUserData } from '../../../store/userSlice';
import TimeAgo from './components/elements/TimeAgo';
import DialogCreateGroup from './components/Dialog/DialogCreateGroup';
import { logOutService } from '../../../services/authService';
import ChatPopoverAction from './components/elements/ChatPopoverAction';
import { urlPublicPage } from '../../../router/constants';
import IconButton from '@mui/material/IconButton';
import { useLocation } from 'react-router-dom';

// Styled Badge for online status (green dot)
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    border: '2px solid white',
    width: 12, // Tăng chiều rộng chấm tròn
    height: 12, // Tăng chiều cao chấm tròn
    borderRadius: '50%', // Đảm bảo chấm luôn tròn
  },
}));


const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface DemoProps {
  window?: () => Window;
}

interface ToolbarActionsSearchProps {
  router: Router;
}

const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({ router }) => {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/settings',);
  };

  return (
    <Stack direction="row">
      <AddFriend router={router} />
      <FriendFunction router={router} />
      <DialogCreateGroup />
      <>
        <IconButton onClick={goToSettings}>
          <SettingsIcon />
        </IconButton>
      </>
      <ThemeSwitcher />
    </Stack>
  );
};

const selects = [
  {
    key: 2,
    primary: 'Thiết lập tài khoản',
    Icon: <SettingsIcon />
  },
];

function SidebarFooterAccountPopover() {

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}></Typography>
      <MenuList>
        {selects.map((select) => (
          <MenuItem
            key={select.key}
            // onClick={() => handleClick(select.key)}
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItem>{select.Icon}</ListItem>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={select.primary}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}


function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean }) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0} overflow="hidden">
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}
const createPreviewComponent = (mini: boolean) => {
  function PreviewComponent(props: AccountPreviewProps) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }: SidebarFooterProps) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent,
        // popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: false,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}


export default function HomePage(props: DemoProps) {
  const { window } = props;
  const dispatch = useAppDispatch();
  const dataUser = useAppSelector(userData);
  const navigate = useNavigate();
  const setToken = useSetToken;
  const queryClient = new QueryClient();
  // const chatId = location.state?.chatId;

  const { data: listChat } = useQuery({
    queryKey: ['listChat'],
    queryFn: getListChatService,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 phút
  });

  // Chỉ kết nối socket khi component mount
  useEffect(() => {
    dispatch(connectSocket());
    return () => {
      dispatch(disconnectSocket());
    };
  }, []);

  // Logout
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


  // Kiểm tra dataUser trước khi set
  const [session, setSession] = React.useState<Session | null>(
    dataUser?.name ? {
      user: {
        name: dataUser.name,
        image: dataUser.avatar,
      },
    } : null
  );

  // Xử lý authentication
  const authentication = React.useMemo(() => ({
    signIn: () => {
      setSession({
        user: {
          name: dataUser.name,
          // email: dataUser.account,
          image: dataUser.avatar,
        },
      });
    },

    signOut: () => {
      logOut();
    }

  }), []);

  const router = useDemoRouter('/');
  const demoWindow = window ? window() : undefined;
  // Tạo danh sách chat
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
      window={demoWindow}
      branding={{ logo: null, title: 'ViVUChat' }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => <ToolbarActionsSearch router={router} />,
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        {router.pathname === '/' ? <WelCome /> : <Chat chatId={router.pathname} />}
      </DashboardLayout>
    </AppProvider>
  );
}
