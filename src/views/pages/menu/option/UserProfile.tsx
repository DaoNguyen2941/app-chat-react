import { useEffect, useState, useRef } from 'react';
import {
    Avatar,
    Box,
    Typography,
    Grid,
    Dialog,
    DialogContent,
    IconButton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../../../services/userService';
import EditNameDialog from '../../../components/DialogEditName';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DialogPreviewAvatar from '../../../components/DialogPreviewAvatar';
const UserProfile: React.FC = () => {
    const [openPreview, setOpenPreview] = useState(false);
    const [openConfirmAvatar, setOpenConfirmAvatar] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const { data: userProfile} = useQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile,
        select: (userData) => userData,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(userProfile?.avatar);

    // Khi userProfile thay đổi thì cập nhật lại avatarPreview (ví dụ lúc load data lần đầu)
    useEffect(() => {
        setAvatarPreview(userProfile?.avatar);
    }, [userProfile]);

    // Mở dialog xem ảnh (background hoặc avatar)
    const handleImageClick = (url: string | null) => {
        if (url) {
            setPreviewImage(url);
            setOpenPreview(true);
        }
    };

    // Chọn file ảnh đại diện mới
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setTempAvatar(previewUrl);
            setSelectedFile(file);
            setOpenConfirmAvatar(true); // mở dialog xác nhận
        }
    };

    // Hủy đổi ảnh đại diện
    const handleCancelAvatar = () => {
        setOpenConfirmAvatar(false);
        setTempAvatar(null);
        setSelectedFile(null);
    };

    return (
        <>
            {/* Background image */}
            <Box
                height={250}
                sx={{
                    backgroundImage: `url(https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/anh-bia-facebook-dep/anh-bia-facebook-dep-nature-bai-bien-binh-minh.jpg?1705621183343)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    cursor: 'pointer',
                }}
                onClick={() => handleImageClick('https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/anh-bia-facebook-dep/anh-bia-facebook-dep-nature-bai-bien-binh-minh.jpg?1705621183343')}
            />

            {/* Avatar + Basic Info */}
            <Box px={3} pb={3}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                        src={avatarPreview}
                        sx={{
                            width: 150,
                            height: 150,
                            border: '3px solid white',
                            mt: -6,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleImageClick(avatarPreview || null)}
                    />

                    {/* Nút nhỏ đổi ảnh */}
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        <CameraAltIcon fontSize="small" />
                    </IconButton>

                    {/* input ẩn để chọn file ảnh */}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography variant="h6">{userProfile?.name}</Typography>
                    <EditNameDialog initialName={userProfile?.name ?? ''} />
                </Box>
                <Typography >@{userProfile?.id}</Typography>

                {/* Details */}
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Email:</Typography>
                        <Typography>{userProfile?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Số Điện Thoại:</Typography>
                        <Typography>{ }</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Tài Khoản:</Typography>
                        <Typography>{ }</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Giới tính:</Typography>
                        <Typography>{ }</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Sinh nhật:</Typography>
                        <Typography>{ }</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" >Địa Chỉ:</Typography>
                        <Typography>{ }</Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Dialog xem ảnh lớn */}
            <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md">
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <Box
                        component="img"
                        src={previewImage}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            display: 'block',
                            margin: 'auto',
                        }}
                    />
                </DialogContent>
            </Dialog>

            <DialogPreviewAvatar
                open={openConfirmAvatar}
                onClose={() => handleCancelAvatar()}
                tempAvatar = {tempAvatar}
                selectedFile={selectedFile}
            />
        </>
    );
};

export default UserProfile;
