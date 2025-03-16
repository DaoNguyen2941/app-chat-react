import * as React from 'react';
import { AppProvider, type Session, } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Chat from './components/chat';
import { createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AddFriend from './components/DialogAddFriend';
import { ThemeSwitcher, } from '@toolpad/core/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { GetListChatService } from '../../../services/chatService';
import Divider from '@mui/material/Divider';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { useState, useEffect } from 'react';
import { IChat } from '../../../commom/type/chat.type';
import WelCome from './components/welCome';
import { useAppDispatch } from '../../../hooks/reduxHook';
import { userData } from '../../../store/userSlice';
import { useAppSelector } from '../../../hooks/reduxHook';
import { Link, useNavigate } from 'react-router-dom';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
  AccountPreviewProps,
} from '@toolpad/core/Account';
import type {
  Navigation, Router
} from '@toolpad/core/AppProvider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { connectSocket, disconnectSocket } from "../../../store/socketSlice"; // Import các action
import FriendFunction from './components/DialogFriend';
import { useSetToken } from '../../../hooks/authHook';
import { setAuth } from '../../../store/authSlice';
import { deleteUserData } from '../../../store/userSlice';
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
  setChatList: React.Dispatch<React.SetStateAction<any[]>>;
  router: Router;
}

const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({ setChatList, router }) => {
  return (
    <Stack direction="row">
      <AddFriend setChatList={setChatList} router={router} />
      <FriendFunction router={router} />
      <ThemeSwitcher />
    </Stack>
  );
};

const accounts = [
  {
    id: 1,
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
    projects: [
      {
        id: 3,
        title: 'Project X',
      },
    ],
  },
  {
    id: 2,
    name: 'Bharat MUI',
    email: 'bharat@mui.com',
    color: '#8B4513', // Brown color
    projects: [{ id: 4, title: 'Project A' }],
  },
];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
                src={account.image ?? ''}
                alt={account.name ?? ''}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              secondary={account.email}
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
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
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
  const dispatch = useAppDispatch()
  const [chatList, setChatList] = useState<IChat[] | []>([]);
  const dataUser = useAppSelector(userData)
  const navigate = useNavigate();
  const setToken = useSetToken

  const { data: listChat, error, isLoading } = useQuery({
    queryKey: ['listChat'],
    queryFn: GetListChatService,
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5
  });

  useEffect(() => {
    dispatch(connectSocket());
  }, [listChat])

  const [session, setSession] = React.useState<Session | null>({
    user: {
      name: dataUser.account,
      // email: dataUser.account,
      image: dataUser.avatar,
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        // setSession({
        //   user: {
        //     name: dataUser.account,
        //     email: dataUser.account,
        //     image: dataUser.avatar,
        //   },
        // });
      },
      signOut: () => {
        setSession(null);
        setToken('');
        dispatch(setAuth({ isAuth: false }))
        dispatch(disconnectSocket())
        dispatch(deleteUserData())
        navigate("/login");
      },
    };
  }, []);

  const router = useDemoRouter('welcome');
  const demoWindow = window !== undefined ? window() : undefined;
  // Tạo navigation từ danh sách người dùng
  const navigation = listChat?.map((chat: IChat) => ({
    segment: chat?.id,
    title: chat?.user.account,
    icon: (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-dot': {
            backgroundColor:
              chat.status === 'online' ? '#44b700' :
                '#555',
          },
        }}
      >
        <Avatar alt={chat.user.name}
          src={chat.user.avatar}
        />
      </StyledBadge>
    ),
    action: chat.unreadCount > 0 ? <Chip label={chat.unreadCount} color="error" size="small" /> : null,
  }));

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={navigation}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={
        {
          logo: null,
          title: 'ViVUChat',
        }
      }
    >
      <DashboardLayout
        // slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount }}
        slots={{
          toolbarActions: () => <ToolbarActionsSearch setChatList={setChatList} router={router} />,
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        {router.pathname === '/welcome' ?
          <WelCome /> : <Chat chatId={router.pathname} />
        }
      </DashboardLayout>
    </AppProvider>
  );
}