import { Link, useNavigate,  } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from '../../components/Input';
import { useMutation, } from '@tanstack/react-query';
import { identifyService } from '../../../services/authService';
import { isAxiosError } from 'axios';
import { IRequestErr } from '../../../type/type';
import MessageErr from '../../components/messageErr';
import { urlPublicPage } from '../../../router/constants';

export interface IFormIdentify {
  keyword: string
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Schema validation
  const schema = yup.object().shape({
    keyword: yup.string().required('Không được để trống trường Email!'),
  });

  // Default values
  const defaultValues: IFormIdentify = {
    keyword: '',
  };

  // useForm hook
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormIdentify>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { mutate, error } = useMutation({
    mutationFn: (value: IFormIdentify) => identifyService(value),
    onSuccess: (res) => {
      console.log(res.data);
      navigate(urlPublicPage.CONFIRM_ACCOUNT, { state: { user: res.data.user, token: res.data.token } });
      reset();
    },
  });

  const onSubmit: SubmitHandler<IFormIdentify> = (data) => {
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
        <h2 className="text-2xl font-bold mb-6 text-center">Tìm tài khoản của bạn</h2>

        {/* Hiển thị lỗi */}
        {errorMessage && <MessageErr message={errorMessage} />}

        {/* Form Login */}
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
              Vui lòng nhập email hoặc tên tài khoản để tìm kiếm tài khoản của bạn.
            </label>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => <Input field={field} type="text" placeholder="email" />}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Tìm tài khoản
          </button>
        </form>

        {/* Chuyển đến trang đăng ký */}
        <div className="mt-4 text-center">
          <Link to={urlPublicPage.LOGIN} className="text-blue-500 hover:underline">
            Quay lại Đang nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
