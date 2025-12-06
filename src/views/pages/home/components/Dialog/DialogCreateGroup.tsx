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
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Chip,
    Box,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createChatGroupService } from "../../../../../services/chatService";
import { IDataFriendType } from "../../../../../type/friend.type";
import { useFriendList } from "../../../../../hooks/friends/useFriendList";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        width: '800px',
        maxWidth: '60%',
        height: '600px',
        maxHeight: '90%',
        display: 'flex',
        flexDirection: 'column',
    },
}));

export default function DialogCreateGroup() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const queryClient = useQueryClient();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedFriends([]);
        setGroupName("");
        setSearch("");
    };

    const { data: friends } = useFriendList(open);

    const toggleFriendSelection = (id: string) => {
        setSelectedFriends((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const { mutate: createGroup } = useMutation({
        mutationFn: () => createChatGroupService(selectedFriends, groupName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listChat"] });
            handleClose();
        },
    });

    const handleCreateGroup = () => {
        if (!groupName.trim() || selectedFriends.length === 0) {
            alert("Vui lòng nhập tên nhóm và chọn ít nhất một người bạn.");
            return;
        }
        createGroup();
    };

    const filteredFriends: IDataFriendType[] = (friends ?? []).filter((friend: IDataFriendType) =>
        friend.user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <Diversity3Icon />
            </IconButton>

            <BootstrapDialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                        Tạo nhóm trò chuyện
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Nhập tên nhóm */}
                        <TextField
                            label="Tên nhóm"
                            fullWidth
                            variant="outlined"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        {/* Ô tìm kiếm */}
                        <TextField
                            fullWidth
                            label="Tìm kiếm bạn bè"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <PersonSearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Danh sách bạn đã chọn */}
                        {selectedFriends.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                                    Bạn bè đã chọn:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {selectedFriends.map((userId) => {
                                        const friend = friends?.find(f => f.user.id === userId);
                                        if (!friend) return null;
                                        return (
                                            <Chip
                                                key={friend.id}
                                                avatar={<Avatar src={friend.user.avatar} />}
                                                label={friend.user.name}
                                                onDelete={() => toggleFriendSelection(friend.user.id)}
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}

                        {/* Danh sách bạn bè */}
                        <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
                            {filteredFriends.length > 0 ? (
                                filteredFriends.map((friend) => (
                                    <ListItem
                                        key={friend.id}
                                        disablePadding
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                checked={selectedFriends.includes(friend.user.id)}
                                                onChange={() => toggleFriendSelection(friend.user.id)}
                                            />
                                        }
                                    >
                                        <ListItemButton onClick={() => toggleFriendSelection(friend.user.id)}>
                                            <ListItemAvatar>
                                                <Avatar src={friend.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText primary={friend.user.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography color="text.secondary" mt={2}>
                                    Không tìm thấy bạn bè.
                                </Typography>
                            )}
                        </List>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || selectedFriends.length === 0}
                    >
                        Tạo nhóm
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
