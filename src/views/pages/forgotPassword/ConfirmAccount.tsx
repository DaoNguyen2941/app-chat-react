import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { getOtpForgotPasswordService } from '../../../services/authService';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { urlPublicPage } from '../../../router/constants';

import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

const ConfirmAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const token = location.state?.token;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return '*@' + domain;
    const firstChar = username[0];
    const lastChar = username[username.length - 1];
    const masked = '*'.repeat(username.length - 2);
    return `${firstChar}${masked}${lastChar}@${domain}`;
  }

  const { mutate: getOTP, isPending } = useMutation({
    mutationFn: (value: string) => getOtpForgotPasswordService(value),
    onSuccess: () => {
      navigate(urlPublicPage.CONFIRM_OTP_RESET_PASSWORD, { state: { email: user.email, token:token } });
    },
  });

  const handleOnClick = () => {    
    getOTP(token)
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5"
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Xác nhận tài khoản
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar src={user.avatar || ''} sx={{ width: 80, height: 80, mb: 1 }} />
          <Typography fontWeight="bold">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">{maskEmail(user.email)}</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOnClick}
          fullWidth
          disabled={isPending}
          startIcon={isPending && <CircularProgress size={20} />}
        >
          {isPending ? 'Đang gửi...' : 'Đây là tài khoản của Tôi!'}
        </Button>
      </Paper>
    </Box>
  );
};

export default ConfirmAccount;
