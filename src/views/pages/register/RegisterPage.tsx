import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from '../../components/Input';
import MessageErr from '../../components/messageErr';
import { useMutation } from '@tanstack/react-query';
import { registerService } from '../../../services/authService'; // Giả sử bạn có service cho đăng ký
import { IFormRegister } from './intreface'; // Tạo interface tương ứng cho form đăng ký
import { isAxiosError } from 'axios';
import { IRequestErr } from '../../../commom/type/type';
import { urlPublicPage } from '../../../router/constants';



const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null)

    const schema = yup.object().shape({
        // username: yup.string().required('Không được để trống username!'),
        account: yup.string().required('Không được để trống account!'),
        email: yup.string().email('Email không hợp lệ').required('Không được để trống email!'),
        password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Không được để trống password!')
    });

    const defaultValues: IFormRegister = {
        // username: '',
        account: '',
        email: '',
        password: ''
    };

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormRegister>({
        defaultValues,
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const { mutate, isError, error, isSuccess } = useMutation({
        mutationFn: (value: IFormRegister) => {
            return registerService(value);
        },
        onSuccess: (res) => {
            const email = res.data.email
            localStorage.setItem('email-register', email)
            navigate("/register/otp");
            reset();
        },
    });

    const onSubmit: SubmitHandler<IFormRegister> = async (data: IFormRegister) => {
        mutate(data);
        reset();
    };

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
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <div>
                    {isAxiosError<IRequestErr>(error) && (
                        <MessageErr message={`${error.response?.data.message}`} />
                    )}
                    {errors && (
                        <MessageErr message={errors.account?.message || errors.email?.message || errors.password?.message} />
                    )}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) =>
                <Input field={field} type="text" placeholder="username" />
              }
            />
          </div> */}

                    <div className="mb-4">
                        <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account</label>
                        <Controller
                            name="account"
                            control={control}
                            render={({ field }) =>
                                <Input field={field} type="text" placeholder="account" />
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) =>
                                <Input field={field} type="email" placeholder="email" />
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) =>
                                <Input field={field} type="password" placeholder="password" />
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        className="text-blue-500 hover:underline"
                        to={urlPublicPage.LOGIN}
                    >
                        Bạn đã có tài khoản? Đang nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
