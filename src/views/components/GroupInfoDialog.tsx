import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Typography, Avatar, Box, CircularProgress,
  List, ListItem, ListItemAvatar, ListItemText,
  ButtonGroup, Button, ListItemButton
} from '@mui/material';
import { getChatGroupDataService, deleterMemberGroupService } from '../../services/chatService';
import { useMutation } from '@tanstack/react-query';
import { IChatGroupInfo } from '../../commom/type/chat.type';
import UserInfoDialog from './UserInfoDialog';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useAppSelector } from '../../hooks/reduxHook';
import { userData } from '../../store/userSlice';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { IChat } from '../../commom/type/chat.type';
interface GroupInfoDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const GroupInfoDialog: React.FC<GroupInfoDialogProps> = ({ open, onClose, groupId }) => {
  const [groupInfo, setGroupInfo] = useState<IChatGroupInfo | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const dataUser = useAppSelector(userData);
  const [isManager, setIsManage] = useState<boolean>(false)
  const queryClient = useQueryClient();

  const { mutate: getGroupInfo, isPending } = useMutation({
    mutationFn: (chatId: string) => getChatGroupDataService(chatId),
    onSuccess: (data) => {
      setGroupInfo(data)
      data.manager.id === dataUser.id ?
        setIsManage(true) : setIsManage(false)
    }
  });

  const { mutate: deleteMember, isPending: deletePending } = useMutation({
    mutationFn: (userId: string) => deleterMemberGroupService(groupId, userId),
    onSuccess: (_data, userId) => {
      setGroupInfo(prev => prev
        ? {
          ...prev,
          members: prev.members.filter(m => m.id !== userId)
        }
        : prev
      );

      queryClient.setQueryData<IChat[]>(['listChat'], oldChats =>
        oldChats?.map(chat =>
          chat.id === groupId && chat.chatGroup
            ? {
              ...chat,
              chatGroup: {
                ...chat.chatGroup,
                members: chat.chatGroup.members.filter(m => m.id !== userId),
              },
            }
            : chat
        )
      );
    },
  });

  useEffect(() => {
    if (open && groupId) {
      getGroupInfo(groupId);
    }
  }, [groupId, open]);

  const handleClicMember = (userId: string) => {
    setSelectedMemberId(userId);
  };

  const handleCloseDialog = () => {
    setSelectedMemberId(null);
  };

  const handleDeleteMember = (userId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này khỏi nhóm?')) {
      deleteMember(userId);
    }
  }

  return (
    <BootstrapDialog open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="customized-dialog-title"

    >
      {isPending || !groupInfo ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle>Thông tin nhóm</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                // src={groupInfo.avatarUrl}
                sx={{ width: 80, height: 80, margin: '0 auto' }}
              />
              <Typography variant="h6" mt={1}>{groupInfo.name}</Typography>
            </Box>

            <Typography variant="subtitle1">Thành viên:</Typography>
            <List>
              {groupInfo.members.map((member) => (
                <ListItemButton
                  key={member.id}
                  onClick={() => handleClicMember(member.id)}
                >
                  <ListItemAvatar>
                    <Avatar alt={member.name} src={member.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      member.id === groupInfo.manager.id
                        ? 'Quản trị viên'
                        : 'Thành viên'
                    }
                  />
                  {isManager && member.id !== groupInfo.manager.id ? (
                    <Button
                      color='error'
                      variant="outlined"
                      startIcon={<PersonOffIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteMember(member.id)
                      }}
                    >
                      Trục xuất
                    </Button>
                  ) : null}
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            {isManager ? (
              <Button >GIải tán nhóm</Button>
            ) : (
              <Button >Thoát nhóm</Button>

            )}
          </DialogActions>
        </>
      )}
      {selectedMemberId && (
        <UserInfoDialog
          open={Boolean(selectedMemberId)}
          onClose={handleCloseDialog}
          userId={selectedMemberId}
        />
      )}
    </BootstrapDialog>
  );
};

export default GroupInfoDialog;
