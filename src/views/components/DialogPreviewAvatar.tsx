import {
    Dialog,
    DialogContent,
    Button,
    DialogActions,
    Avatar
} from '@mui/material';
// import { updateUserAvatar } from '../../../../services/userService'; // bạn cần tạo hàm này
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeUserAvatarService } from '../../services/userService';
import { IUser } from '../../type/user.type';
import { useAppDispatch } from '../../hooks/reduxHook';
import { setAvatarorName } from '../../store/userSlice';

interface DialogPreviewAvatarProps {
    open: boolean;
    onClose: () => void;
    tempAvatar: string | null,
    selectedFile: File | null
}

const DialogPreviewAvatar: React.FC<DialogPreviewAvatarProps> = ({
    open,
    onClose,
    tempAvatar,
    selectedFile,
}) => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File) => changeUserAvatarService(file),
        onSuccess: (data) => {
            queryClient.setQueryData(['user-profile'], (oldData: IUser | undefined) => {
                if (!oldData) return data;
                return {
                    ...oldData,
                    avatar: data.avatar.url,
                };
            });
            dispatch(setAvatarorName({avatar: data.avatar.url}));
            onClose();
        }
    });

    const handleConfirm = () => {
        if (selectedFile) {
            mutate(selectedFile);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar src={tempAvatar ?? undefined} sx={{ width: 500, height: 500 }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={isPending}>
                    Hủy
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                    disabled={!selectedFile || isPending}
                >
                    {isPending ? 'Đang cập nhật...' : 'OK'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default DialogPreviewAvatar;
