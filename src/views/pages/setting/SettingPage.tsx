import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import UsetProfile from './menu/UserProfile';
import UserProfileForm from './menu/UpdateProfile';
import UpdatePassword from './menu/UpdatePassword';
import FriendsList from './menu/friendsList';
import GroupList from './menu/GroupsList';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import { useLocation } from 'react-router-dom';

const menuItems = [
    { key: 'account', label: 'Tài khoản', icon: <AccountBoxIcon /> },
    { key: 'update-info', label: 'Cập nhật thông tin', icon: <EditNoteOutlinedIcon /> },
    { key: 'change-password', label: 'Đổi mật khẩu', icon: <LockOutlinedIcon /> },
    { key: 'friends', label: 'Bạn bè', icon: <GroupOutlinedIcon /> },
    { key: 'groups', label: 'Nhóm', icon: <Diversity3OutlinedIcon /> },
];

const contentMap: Record<string, React.ReactNode> = {
    account: <UsetProfile />,
    'update-info': <UserProfileForm />,
    'change-password': <UpdatePassword />,
    friends: <FriendsList />,
    groups: <GroupList />,
};

const SettingsPage: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState('account');
    return (
        <Box display="flex" height="100vh" p={2}>
            {/* Sidebar */}
            <Paper sx={{ width: 250, mr: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.key}
                            selected={selectedKey === item.key}
                            onClick={() => setSelectedKey(item.key)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            {/* Content */}
            <Paper sx={{ flexGrow: 1, p: 2 }}>
                {contentMap[selectedKey] ?? <Typography>Không tìm thấy nội dung</Typography>}
            </Paper>
        </Box>
    );
};

export default SettingsPage;
