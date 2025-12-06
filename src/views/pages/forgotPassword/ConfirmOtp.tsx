import React from 'react';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from '../../components/Input';
import MessageErr from '../../components/messageErr';
import { useMutation } from '@tanstack/react-query';
import { confirmOtpResetPasswordService } from '../../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { urlPublicPage } from '../../../router/constants';

interface InputOtp {
    OTP: string
}

const ConfirmOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token: string = location.state?.token;
  const email: string = location.state?.email;

  const schema = yup.object().shape({
    OTP : yup.string()
      .length(6, 'OTP phải có 6 ký tự')
      .required('Vui lòng nhập mã OTP'),
  });

  const defaultValues: InputOtp = {
    OTP : '',
  };

  const { control, handleSubmit, formState: { errors } } = useForm<InputOtp>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { mutate, isError } = useMutation({
    mutationFn: (value: InputOtp) => {
      return confirmOtpResetPasswordService(token, value.OTP);
    },
    onSuccess: () => {
      navigate(urlPublicPage.RESET_PASSWORD, {state: {isComfirmOtp: true}})
    }
  });

  const onSubmit: SubmitHandler<InputOtp> = (data) => {
    mutate(data);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Xác Thực OTP</h2>
        <p className="text-center mb-4 text-gray-700">
          Đã gửi mã OTP xác thực đến email: {email.replace(/(.{2}).+(@.*)/, "$1****$2")}. Hãy kiểm tra hộp thư của bạn.
        </p>
        <div>
          {isError && <MessageErr message="OTP không hợp lệ hoặc đã hết hạn." />}
          {errors.OTP  && <MessageErr message={errors.OTP.message} />}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Mã OTP</label>
            <Controller
              name="OTP"
              control={control}
              render={({ field }) => (
                <Input field={field} type="text" placeholder="Nhập mã OTP" />
              )}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Xác Thực OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOtp;
