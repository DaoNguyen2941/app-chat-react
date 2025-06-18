import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Typography,
    Grid,
    Dialog,
    DialogContent,
    CircularProgress,
} from '@mui/material';
import { IUserType } from '../../commom/user.type';
import { getUserDataService } from '../../services/userService';
import { useMutation, useQueryClient, } from '@tanstack/react-query';

interface UserInfoDialogProps {
    userId: string;
    open: boolean;
    onClose: () => void;
}

const UserInfoDialog: React.FC<UserInfoDialogProps> = ({ userId, open, onClose }) => {
    const [user, setUser] = useState<IUserType | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (userId: string) => getUserDataService(userId),
        onSuccess: (data) => setUser(data),
    });

    useEffect(() => {
        if (open && userId) {
            console.log(userId);
            mutate(userId);
        }
    }, [userId, open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ p: 0 }}>
                {isPending || !user ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box
                            height={200}
                            sx={{
                                backgroundImage: `url(https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/anh-bia-facebook-dep/anh-bia-facebook-dep-nature-bai-bien-binh-minh.jpg?1705621183343)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                            }}
                        />
                        <Box px={3} pb={3}>
                            <Avatar
                                src={user.avatar}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '3px solid white',
                                    mt: -6,
                                }}
                            />
                            <Typography variant="h6" mt={1}>
                                {user.name}
                            </Typography>
                            <Typography color="text.secondary">@{user.name}</Typography>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">SĐT</Typography>
                                    <Typography>{ }</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Giới tính</Typography>
                                    <Typography>{ }</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Sinh nhật</Typography>
                                    <Typography>{ }</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserInfoDialog;
