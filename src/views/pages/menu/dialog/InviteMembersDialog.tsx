import React, { useState, useMemo } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemAvatar, ListItemText,
    Avatar, Checkbox, Button,
    Box, Chip, Typography, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getListFriend } from '../../../../services/friendService';
import { IDataFriendType } from '../../../../commom/type/friend.type';

interface InviteMembersDialogProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
    existingMemberIds: string[];
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
    open,
    onClose,
    groupId,
    existingMemberIds
}) => {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: friends = [], isLoading } = useQuery<IDataFriendType[]>({
        queryKey: ['friends'],
        queryFn: getListFriend,
        enabled: open
    });

    const selectableUsers = useMemo(
        () => friends.filter(f => !existingMemberIds.includes(f.user.id) && !selectedUserIds.includes(f.user.id)),
        [friends, existingMemberIds, selectedUserIds]
    );

    const selectedUsers = useMemo(
        () => friends.filter(f => selectedUserIds.includes(f.user.id)),
        [friends, selectedUserIds]
    );

    const filteredSelectableUsers = useMemo(() => {
        return selectableUsers.filter(f =>
            f.user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, selectableUsers]);

    const handleToggle = (userId: string) => {
        setSelectedUserIds((prev) => [...prev, userId]);
    };

    const handleRemoveSelected = (userId: string) => {
        setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    };

    const handleInvite = () => {
        console.log('Inviting users:', selectedUserIds);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Mời thành viên vào nhóm</DialogTitle>
            <DialogContent dividers
                sx={{
                    minHeight: 500,
                    maxHeight: 550,
                    overflowY: 'auto'
                }}>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {selectedUsers.length > 0 && (
                    <Box mb={2}>
                        <Typography variant="subtitle1">Đã chọn:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {selectedUsers.map(({ user }) => (
                                <Chip
                                    key={user.id}
                                    avatar={<Avatar src={user.avatar} />}
                                    label={user.name}
                                    onDelete={() => handleRemoveSelected(user.id)}
                                    deleteIcon={<CloseIcon />}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <List>
                    {filteredSelectableUsers.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Không tìm thấy người dùng phù hợp.
                        </Typography>
                    )}
                    {filteredSelectableUsers.map(({ user }) => (
                        <ListItem key={user.id} onClick={() => handleToggle(user.id)} disableGutters>
                            <ListItemAvatar>
                                <Avatar src={user.avatar} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} />
                            <Checkbox edge="end" checked={false} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleInvite}
                    disabled={selectedUserIds.length === 0}
                >
                    Mời ({selectedUserIds.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteMembersDialog;
