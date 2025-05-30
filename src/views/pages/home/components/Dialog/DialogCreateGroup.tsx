import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Checkbox,
    Button,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { styled } from '@mui/material/styles';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import { useState } from "react";
import { useEffect } from "react";
import List from '@mui/material/List';
import { getListFriend } from "../../../../../services/friendService";
import { createChatGroupService } from "../../../../../services/chatService";
import { IDataFriendType } from '../../../../../commom/type/friend.type';
import {  useQueryClient, useMutation, useQuery, } from '@tanstack/react-query';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        width: '800px', // Đặt chiều rộng
        maxWidth: '60%', // Đặt giới hạn tối đa chiều rộng
        height: '600px', // Đặt chiều cao
        maxHeight: '90%', // Đặt giới hạn tối đa chiều cao
    },
}));

export default function DialogCreateGroup() {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [groupName, setGroupName] = React.useState("");
    const queryClient = useQueryClient();

    // Mở / Đóng dialog
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedFriends([])
    }

    const { data: friends, isLoading } = useQuery({
        queryKey: ['friends'],
        queryFn: getListFriend,
        enabled: open, // chỉ gọi khi dialog mở
    });

    // Xử lý chọn bạn bè
    const toggleFriendSelection = (id: string) => {
        setSelectedFriends((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const { mutate: createGroup } = useMutation({
        mutationFn: () => {
            return createChatGroupService(selectedFriends, groupName)
        },
        onSuccess(data,) {
            queryClient.invalidateQueries({ queryKey: ["listChat"] });
            setOpen(false);
            setSelectedFriends([]);
            setGroupName("");
        },
    })

    // Tạo nhóm
    const handleCreateGroup = () => {
        if (!groupName.trim() || selectedFriends.length === 0) {
            console.log(123);
            alert("Vui lòng nhập tên nhóm và chọn ít nhất một người bạn.");
            return;
        }
        createGroup()
    };

    // Lọc danh sách bạn bè
    const filteredFriends: IDataFriendType[] = (friends ?? []).filter((friend: IDataFriendType) =>
        friend.user.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <React.Fragment>
            {/* Nút mở Dialog */}
            <IconButton onClick={handleClickOpen}>
                <Diversity3Icon />
            </IconButton>

            {/* Dialog tạo nhóm */}
            <BootstrapDialog open={open} onClose={handleClose}>
                {/* Tiêu đề */}
                <DialogTitle className="flex justify-between items-center p-4 border-b">
                    <span className="text-lg font-semibold">Tạo nhóm trò chuyện</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* Nội dung Dialog */}
                <DialogContent className="p-4 space-y-4">
                    {/* Ô nhập tên nhóm */}
                    <TextField
                        label="Tên nhóm"
                        fullWidth
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    {/* Ô tìm kiếm bạn bè */}
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton type="button" aria-label="search" size="small">
                                        <PersonSearchIcon />
                                    </IconButton>
                                ),
                                sx: { pr: 0.5 },
                            },
                        }}
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'inline-block'
                            },
                            mr: 1,
                            flex: 1,
                        }}
                    />
                    {/* Hiển thị danh sách bạn bè đã chọn */}
                    {selectedFriends.length > 0 && (
                        <div className="p-2 border rounded-md">
                            <Typography variant="subtitle1" className="mb-2 font-semibold">
                                Bạn bè đã chọn:
                            </Typography>
                            <List sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {selectedFriends.map((userId) => {
                                    const friend = (friends ?? []).find((f: IDataFriendType) => f.user.id === userId);
                                    return (
                                        friend && (
                                            <ListItem
                                                key={friend.id}
                                                sx={{
                                                    width: "auto",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    padding: "4px 8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                {/* <Avatar sx={{ width: 30, height: 30 }} /> */}
                                                <Typography>{friend.user.name}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleFriendSelection(friend.user.id)}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </ListItem>
                                        )
                                    );
                                })}
                            </List>
                        </div>
                    )}

                    {/* Danh sách bạn bè */}
                    <List>
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <ListItem
                                    key={friend.id}
                                    sx={{ width: '100%' }}
                                    secondaryAction={
                                        <Checkbox
                                            checked={selectedFriends.includes(friend.user.id)}
                                            onChange={() => toggleFriendSelection(friend.user.id)}
                                        />
                                    }
                                >
                                    <ListItemButton sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={`${friend.user.name}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <Typography className="text-gray-500">Không tìm thấy bạn bè.</Typography>
                        )}
                    </List>
                </DialogContent>

                {/* Nút tạo nhóm */}
                <DialogActions className="p-4">
                    <Button onClick={handleClose} className="text-gray-600">
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || selectedFriends.length === 0} // Điều kiện disable
                    >
                        Tạo nhóm
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
