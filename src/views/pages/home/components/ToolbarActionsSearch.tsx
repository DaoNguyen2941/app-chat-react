import type { Router } from '@toolpad/core/AppProvider';
import {  useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../hooks/reduxHook';
import { notification } from '../../../../store/notificationSlice';
import { urlPrivatepPage } from '../../../../router/constants';
import Stack from '@mui/material/Stack';
import AddFriend from '.././components/Dialog/DialogAddFriend';
import FriendFunction from '.././components/Dialog/DialogFriend';
import DialogCreateGroup from '.././components/Dialog/DialogCreateGroup';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ListIcon from '@mui/icons-material/List';
import { ThemeSwitcher, } from '@toolpad/core/DashboardLayout';


interface ToolbarActionsSearchProps {
  router: Router;
}

export const ToolbarActionsSearch: React.FC<ToolbarActionsSearchProps> = ({ router }) => {
  const navigate = useNavigate();
  const numberNotification = useAppSelector(notification)

  const goToSettings = () => {
    navigate(urlPrivatepPage.MENU.PROFILE);
  };

  return (
    <Stack direction="row">
      <AddFriend router={router} />
      <FriendFunction router={router} />
      <DialogCreateGroup />
      <>
        <IconButton onClick={goToSettings}>
          <Badge badgeContent={numberNotification.total} color="error">
            <ListIcon />
          </Badge>
        </IconButton>
      </>
      <ThemeSwitcher />
    </Stack>
  );
};