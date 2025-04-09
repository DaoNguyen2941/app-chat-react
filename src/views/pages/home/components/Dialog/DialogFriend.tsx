import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import NavigationFriends from '../elements/navigationFriend';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { notification, setNumberInvitation } from '../../../../../store/notificationSlice';
import { useAppSelector, useAppDispatch } from '../../../../../hooks/reduxHook';
import { getListReqFriend } from '../../../../../services/friendService';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { Navigation, Router } from '@toolpad/core/AppProvider';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        width: '500px', // Đặt chiều rộng
        maxWidth: '60%', // Đặt giới hạn tối đa chiều rộng
        height: '600px', // Đặt chiều cao
        maxHeight: '90%', // Đặt giới hạn tối đa chiều cao
    },
}));

interface IProps  {
    router: Router
}

function notificationsLabel(count: number) {
    if (count === 0) {
        return 'no notifications';
    }
    if (count > 99) {
        return 'more than 99 notifications';
    }
    return `${count} notifications`;
}

export default function FriendFunction(props: IProps) {
    const { router } = props;
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const numberNotification = useAppSelector(notification)
    const dispatch = useAppDispatch()
    const hasFetched = useRef(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const { mutate } = useMutation({
        mutationFn: () => {
            return getListReqFriend()
        },
        onSuccess: (res) => {
            dispatch(setNumberInvitation(res.data.length))
        }
    })

    useEffect(() => {
        if (!hasFetched.current) {
          mutate();
          hasFetched.current = true; 
        }
      }, [mutate]);

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen} aria-label={notificationsLabel(100)}>
                <Badge badgeContent={numberNotification.total} color="error">
                    <PeopleIcon />
                </Badge>
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2, justifyContent: "center" }} id="customized-dialog-title">
                    Modal title
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
                    <NavigationFriends value={value} setOpentDialog = {setOpen} router = {router}/>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Lời mời" icon={
                            <StyledBadge badgeContent={numberNotification.invitation} color="error">
                                <PersonAddIcon />
                            </StyledBadge>
                        } />
                        <BottomNavigationAction label="Bạn bè" icon={<PeopleIcon />} />
                        {/* <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} /> */}
                    </BottomNavigation>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));