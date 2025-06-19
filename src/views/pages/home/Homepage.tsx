import * as React from 'react';
import { AppProvider, type Session, } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Chat from './components/chat';
import { createTheme } from '@mui/material/styles';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useEffect } from 'react';
import { IChat } from '../../../type/chat.type';
import WelCome from '../../components/welCome';
import { useAppDispatch } from '../../../hooks/reduxHook';
import { userData } from '../../../store/userSlice';
import { useAppSelector } from '../../../hooks/reduxHook';
import { useNavigate } from 'react-router-dom';
import AvatarGroup from '@mui/material/AvatarGroup';
import { connectSocket, disconnectSocket } from "../../../store/socketSlice";
import { useSetToken } from '../../../hooks/authHook';
import { setAuth } from '../../../store/authSlice';
import { deleteUserData } from '../../../store/userSlice';
import TimeAgo from './components/elements/TimeAgo';
import { logOutService } from '../../../services/authService';
import ChatPopoverAction from './components/elements/ChatPopoverAction';
import { urlPublicPage } from '../../../router/constants';
import { useChatList } from '../../../hooks/chat/useChatList';
import { useFriendInvitations } from '../../../hooks/friends/useFriendInvitations';
import { useFriendList } from '../../../hooks/friends/useFriendList';
import { useGroupInvitations } from '../../../hooks/chat/useGroupInvation';
import { SidebarFooterAccount } from './components/SidebarFooterAccount';
import { SidebarFooterAccountPopover } from './components/SidebarFooterAccountPopover';
import { ToolbarActionsSearch } from './components/ToolbarActionsSearch';
import { useHomePageData } from '../../../hooks/useHomePageData';
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


export default function HomePage(props: DemoProps) {
  const { window } = props;
  const dispatch = useAppDispatch();
  const dataUser = useAppSelector(userData);
  const navigate = useNavigate();
  const setToken = useSetToken;
  const queryClient = new QueryClient();

  const {
    groupInvitation,
    friendList,
    friendInvitations,
    chatList,
  } = useHomePageData();
  
  function ToolbarSlot() {
    return <ToolbarActionsSearch router={router} />;
  }
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
  const listChats = chatList?.map((chat: IChat) => ({
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
      branding={{ logo: <img src="https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/logo.png" />, title: 'ViVUChat' }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarSlot,
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        {router.pathname === '/' ? <WelCome /> : <Chat chatId={router.pathname} />}
      </DashboardLayout>
    </AppProvider>
  );
}
