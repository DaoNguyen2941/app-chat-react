import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { IFormLogin } from '../../../type/form.type';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from '../../components/Input';
import { useMutation, } from '@tanstack/react-query';
import { loginService } from '../../../services/authService';
import { isAxiosError } from 'axios';
import { IRequestErr } from '../../../type/type';
import MessageErr from '../../components/messageErr';
import { useSetToken } from '../../../hooks/authHook';
import { useAppDispatch } from '../../../hooks/reduxHook';
import { setAuth } from '../../../store/authSlice';
import { setUserData } from '../../../store/userSlice';
import { urlPublicPage } from '../../../router/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setToken = useSetToken;
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    account: yup.string().required('Không được để trống account!'),
    password: yup.string().required('Không được để trống password!'),
  });

  const defaultValues: IFormLogin = {
    account: '',
    password: '',
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLogin>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { mutate, error } = useMutation({
    mutationFn: (value: IFormLogin) => loginService(value),
    onSuccess: (res) => {
      setToken(res.data.token);
      dispatch(setAuth({ isAuth: true }));
      dispatch(setUserData(res.data.user));
      navigate('/home');
      reset();
    },
  });

  const onSubmit: SubmitHandler<IFormLogin> = (data) => {
    mutate(data);
  };

  const errorMessage =
    isAxiosError<IRequestErr>(error) && error.response?.status === 401
      ? 'Tài khoản hoặc mật khẩu không chính xác'
      : errors.account?.message || errors.password?.message;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMessage && <MessageErr message={errorMessage} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
              Tài khoản
            </label>
            <Controller
              name="account"
              control={control}
              render={({ field }) => <Input field={field} type="text" placeholder="account" />}
            />
          </div>

          <div className="mb-4">
            Mật khẩu
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input field={field} type="password" placeholder="password" />}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to={urlPublicPage.REGISTER} className="text-blue-500 hover:underline">
            Bạn không có tài khoản? Đang ký!
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link to={urlPublicPage.FORGOT_PASSWORD} className="text-blue-500 hover:underline">
            Bạn quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
