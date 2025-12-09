import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { changeUserNameService } from '../../services/userService';
import { IFormUpdateNameUser } from '../../type/form.type';
import Input from '../components/Input';
import { useQueryClient } from '@tanstack/react-query';
import { IUser } from '../../type/user.type';
import { useAppDispatch } from '../../hooks/reduxHook';
import { setAvatarorName } from '../../store/userSlice';

interface EditNameDialogProps {
  initialName: string;
}

const EditNameDialog: React.FC<EditNameDialogProps> = ({ initialName }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

  const schema = yup.object({
    name: yup.string().required('Không được để trống!'),
  });

  const {
    control,
    reset,
    handleSubmit,
    // formState: { errors },
  } = useForm<IFormUpdateNameUser>({
    defaultValues: { name: initialName },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (value: IFormUpdateNameUser) => changeUserNameService(value),
    onSuccess: (dataUpdate) => {
      queryClient.setQueryData(['user-profile'], (oldData: IUser | undefined) => {
        if (!oldData) return dataUpdate;
        return {
          ...oldData,
          name: dataUpdate.newName,
        };
      });
      dispatch(setAvatarorName({ name: dataUpdate.newName }));
      reset();
      setOpen(false);
    },
  });

  const handleOpen = () => {
    reset({ name: initialName });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<IFormUpdateNameUser> = (data) => {
    mutate(data);
  };

  return (
    <>
      <Tooltip title="Chỉnh sửa tên">
        <IconButton size="small" onClick={handleOpen}>
          <BorderColorIcon fontSize="small" color='primary'/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: '600px',
              height: '400px',
              maxWidth: 'none',
            },
          },
        }}
      >
        <DialogTitle>Chỉnh sửa tên</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            <Box component="span" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              Lưu ý:
            </Box>{' '}
            Sau khi đổi tên bạn phải đợi 7 ngày tiếp theo mới có thể đổi lại. Bạn nên cân nhắc kỹ trước khi đổi tên!
          </Typography>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên hiển thị
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input field={field} type="text" placeholder="Tên mới của bạn" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditNameDialog;
