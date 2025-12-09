import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteChatService } from '../../../../../services/chatService';
import { IChat } from '../../../../../type/chat.type';
import { ChatIsOpent } from '../../../../../store/socketSlice';
import { useAppSelector } from '../../../../../hooks/reduxHook';
import type { Router } from '@toolpad/core/AppProvider';

interface IChatPopoverActionProps {
  chatId: string;
  isGroup: boolean;
  router: Router;
}

interface IDeleteChatParams {
  chatId: string;
  isGroup: boolean;
};

const ChatPopoverAction: React.FC<IChatPopoverActionProps> = ({ chatId, isGroup,router }) => {
  
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);
    const isPopoverOpen = Boolean(popoverAnchorEl);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;
    const queryClient = useQueryClient();
    const idChatOpent = useAppSelector(ChatIsOpent)

    const handlePopoverButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setPopoverAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setPopoverAnchorEl(null);
    };


    
    const { mutate: deleteChat } = useMutation({
      mutationFn: ({ chatId, isGroup }: IDeleteChatParams) => {
        return deleteChatService(chatId, isGroup);
      },
      onSuccess: (res, variables) => {
        if (idChatOpent === chatId) {
          router.navigate('/')
        }
        queryClient.setQueryData(['listChat'], (oldData: any) => {
          if (!oldData) return [];
          return oldData.filter((chat: IChat) => chat.id !== variables.chatId);
        });
      },
    });

   const handeDeleteChat = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setPopoverAnchorEl(null);
    const data :IDeleteChatParams = {
       chatId,
       isGroup
    }
    deleteChat(data)
   }

  return (
    <React.Fragment >
      <IconButton aria-describedby={popoverId} onClick={handlePopoverButtonClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableAutoFocus
        disableAutoFocusItem
      >
        <MenuItem onClick={handeDeleteChat}>Xóa đoạn hội thoại</MenuItem>
        {/* <MenuItem onClick={handlePopoverClose}>Ẩn đoạn hội thoại</MenuItem> */}
      </Menu>
    </React.Fragment>
  );
};

export default ChatPopoverAction;
