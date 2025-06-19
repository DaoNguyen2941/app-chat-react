import { Link, useNavigate, useLocation} from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from '../../components/Input';
import { useMutation, } from '@tanstack/react-query';
import { resetPasswordService } from '../../../services/authService';
import { isAxiosError } from 'axios';
import { IRequestErr } from '../../../type/type';
import MessageErr from '../../components/messageErr';
import { urlPublicPage } from '../../../router/constants';
import { useEffect } from 'react';

export interface IFormResetPassword {
    password: string,
    confirmPassword: string
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const isComfirmOtp: string = location.state?.isComfirmOtp;

  useEffect(() => {
    if (!isComfirmOtp) {
      navigate('/login/identify'); // hoặc nơi bắt đầu quy trình
    }
  }, [isComfirmOtp, navigate]);

    // Schema validation
    const schema = yup.object().shape({
        password: yup
            .string()
            .required('Không được để trống password!')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

        confirmPassword: yup
            .string()
            .required('Không được để trống password!')
            .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
    });

    // Default values
    const defaultValues: IFormResetPassword = {
        password: '',
        confirmPassword: ''
    };

    // useForm hook
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormResetPassword>({
        defaultValues,
        mode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    // Mutation để gọi API login
    const { mutate, error } = useMutation({
        mutationFn: (value: IFormResetPassword) => resetPasswordService(value),
        onSuccess: (res) => {
            navigate(urlPublicPage.LOGIN);
            reset();
        },
    });

    const onSubmit: SubmitHandler<IFormResetPassword> = (data) => {
        mutate(data);
    };

    let errorMessage: string | null = null;

    if (isAxiosError<IRequestErr>(error)) {
        if (error.response?.status === 404) {
            errorMessage = 'Không tìm thấy tài khoản phù hợp với thông tin của bạn!';
        } else {
            errorMessage = error.response?.data?.message[0] || 'Đã có lỗi xảy ra, vui lòng thử lại!';
        }
    }


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
                <h2 className="text-2xl font-bold mb-6 text-center">Hãy nhập mật khẩu mới</h2>

                {/* Hiển thị lỗi */}
                {errorMessage && <MessageErr message={errorMessage} />}

                {/* Form reset password */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-4">

                        {!errors.password ? (
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                        ) : (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => <Input field={field} type="password" placeholder="password" />}
                        />
                    </div>

                    <div className="mb-4">

                        {!errors.confirmPassword ? (
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Nhập lại mật khẩu mới
                            </label>
                        ) : (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => <Input field={field} type="password" placeholder="confirm password" />}
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>

                {/* Chuyển đến trang đăng nhập*/}
                <div className="mt-4 text-center">
                    <Link to={urlPublicPage.LOGIN} className="text-blue-500 hover:underline">
                        Quay lại Đang nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
