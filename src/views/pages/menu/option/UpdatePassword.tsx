import { Box, Button, Grid, Typography } from '@mui/material';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { IFormChangePassword } from '../../../../commom/form.type';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from '../../../components/Input';
import { useMutation } from '@tanstack/react-query';
import { changeUserPasswordService } from '../../../../services/userService';
import { isAxiosError } from 'axios';
import { IRequestErr } from '../../../../commom/type';
import MessageErr from '../../../components/messageErr';
import MessageSuccess from '../../../components/MessageSuccess';

const UpdatePassword: React.FC = () => {

  const schema = yup.object().shape({
    password: yup
      .string()
      .required('Không được để trống!'),
    newPassword: yup
      .string()
      .required('Không được để trống!')
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: yup
      .string()
      .required('Không được để trống!')
      .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp!'),
  });

  const defaultValues = {
    password: '',
    newPassword: '',
    confirmPassword: ''
  };

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormChangePassword>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { mutate, error, isSuccess, data } = useMutation({
    mutationFn: (value: IFormChangePassword) => changeUserPasswordService(value),
    onSuccess: (res) => {
      reset();
    },
  });

  const onSubmit: SubmitHandler<IFormChangePassword> = (data) => {
    mutate(data);
  };

const errorMessage =
  isAxiosError<IRequestErr>(error) && error.response?.status === 400
    ? Array.isArray(error.response.data.message)
      ? error.response.data.message[0]
      : error.response.data.message
    : errors.password?.message ??
      errors.newPassword?.message ??
      errors.confirmPassword?.message;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Đổi mật khẩu
      </Typography>
      {errorMessage && <MessageErr message={errorMessage} />}
    {isSuccess? (<MessageSuccess message={'Thay đổi mật khẩu thành công!'}/>) : null}
      <form onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input field={field} type="password" placeholder="Mật khẩu cũ" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => <Input field={field} type="password" placeholder="Mật khẩu mới" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input field={field} type="password" placeholder="Nhập lại mật khẩu mới" />}
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Lưu thay đổi
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdatePassword;
