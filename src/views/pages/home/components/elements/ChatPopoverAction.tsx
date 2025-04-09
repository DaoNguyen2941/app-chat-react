// components/chat/ChatPopoverAction.tsx

import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface ChatPopoverActionProps {
  onDelete?: () => void;
  onHide?: () => void;
}

const ChatPopoverAction: React.FC<ChatPopoverActionProps> = ({ onDelete, onHide }) => {
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null);

    const isPopoverOpen = Boolean(popoverAnchorEl);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;
  
    const handlePopoverButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setPopoverAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setPopoverAnchorEl(null);
    };

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
        <MenuItem onClick={handlePopoverClose}>Xóa đoạn hội thoại</MenuItem>
        <MenuItem onClick={handlePopoverClose}>Ẩn đoạn hội thoại</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ChatPopoverAction;
