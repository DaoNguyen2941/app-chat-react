import React from 'react';
import { Box, List, ListItemButton, ListItemText, Paper, ListItemIcon } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import HomeIcon from '@mui/icons-material/Home';
import { urlPrivatepPage } from '../../../../router/constants';

const menuItems = [
    { url: urlPrivatepPage.HOME, label: 'home', icon: <HomeIcon /> },
    { url: urlPrivatepPage.MENU.PROFILE, label: 'Tài khoản', icon: <AccountBoxIcon /> },
    { url: urlPrivatepPage.MENU.UPDATE_PROFILE, label: 'Cập nhật thông tin', icon: <EditNoteOutlinedIcon /> },
    { url: urlPrivatepPage.MENU.UPDATE_PASSWORD, label: 'Đổi mật khẩu', icon: <LockOutlinedIcon /> },
    { url: urlPrivatepPage.MENU.FRIENDS, label: 'Bạn bè', icon: <GroupOutlinedIcon /> },
    { url: urlPrivatepPage.MENU.FRIEND_REQUETS, label: 'Yêu cầu kết bạn', icon: <GroupOutlinedIcon /> },
    { url: urlPrivatepPage.MENU.GROUPS, label: 'Nhóm', icon: <Diversity3OutlinedIcon /> },
    { url: urlPrivatepPage.MENU.GROUPS_REQUETS, label: 'lời mời vào nhóm', icon: <Diversity3OutlinedIcon /> },

];

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const selected = params.get('tab') || 'account';

    // Lấy theme từ localStorage (mặc định 'light' nếu chưa có)
    const theme = localStorage.getItem('toolpad-mode')
    const isDark = theme === 'dark';

    const handleSelect = (url: string) => {
        navigate(url);
    };

    return (
        <Box
            display="flex"
            height="100vh"
            p={2}
            bgcolor={isDark ? '#121212' : 'white'} // nền tối hoặc sáng
            color={isDark ? 'white' : 'black'} // màu chữ tương ứng
        >
            <Paper
                sx={{
                    width: 250,
                    mr: 2,
                    bgcolor: isDark ? '#1e1e1e' : 'white',
                    color: isDark ? 'white' : 'black',
                }}
                elevation={3}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.url}
                            selected={selected === item.url}
                            onClick={() => handleSelect(item.url)}
                            disabled={item.url === urlPrivatepPage.MENU.UPDATE_PROFILE}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: isDark ? '#333' : '#e0e0e0',
                                    color: isDark ? '#90caf9' : 'blue',
                                },
                                '&:hover': {
                                    backgroundColor: isDark ? '#444' : '#f5f5f5',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: isDark ? 'white' : 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            <Paper
                sx={{
                    flexGrow: 1,
                    p: 2,
                    bgcolor: isDark ? '#121212' : 'white',
                    color: isDark ? 'white' : 'black',
                }}
                elevation={3}
            >
                {children}
            </Paper>
        </Box>
    );
};

export default SettingsLayout;
