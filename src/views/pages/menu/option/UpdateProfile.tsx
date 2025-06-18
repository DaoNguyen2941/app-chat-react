import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from '../../../components/Input';
import { IFormProfileUser } from '../../../../commom/form.type';
import { useQueryClient } from '@tanstack/react-query';
import { IUser } from '../../../../commom/user.type';
import { GenderType } from '../../../../commom/user.type';

const initialData = {
  avatarUrl: '',
  backgroundUrl: '',
  name: '',
  username: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
};

const background = 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/anh-bia-facebook-dep/anh-bia-facebook-dep-nature-bai-bien-binh-minh.jpg?1705621183343'

const UserProfileForm: React.FC = () => {
  const [formData, setFormData] = useState(initialData);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<IUser>(['user-profile']);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(userData?.avatar);

  const handleAvatarChange = (file: File) => {
    setAvatarPreview(URL.createObjectURL(file));
  };

  const defaultValues: IFormProfileUser = {
    avatar: undefined,
    name: userData?.name || '',
    birthday: undefined,
    gender: 'Other',
    phone: '0123456789'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const schema = yup.object().shape({
    avatar: yup
      .mixed<File>()
      .test('fileSize', 'File quá lớn', (value) => {
        if (!value) return true; // không bắt buộc
        return value.size <= 1 * 1024 * 1024; // <= 1MB
      })
      .test('fileType', 'Định dạng không hợp lệ', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png'].includes(value.type);
      }),
    name: yup
      .string()
      .required()
      .default(userData?.name)
      .min(2, 'Tên ít nhất phải có 2 ký tự'),
    birthday: yup.date(),
    gender: yup
      .mixed<GenderType>()
      .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  });

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormProfileUser>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, key: 'avatarUrl' | 'backgroundUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [key]: url }));
    }
  };

  const onSubmit: SubmitHandler<IFormProfileUser> = (data) => {
    // mutate(data);
  };

  const formatDateToInput = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Avatar + Background Upload */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        {/* Background Image */}
        <Box
          sx={{
            height: 200,
            borderRadius: 2,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#e0e0e0',
            cursor: 'pointer',
          }}
          onClick={() => backgroundInputRef.current?.click()}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={backgroundInputRef}
          onChange={(e) => handleImageSelect(e, 'backgroundUrl')}
        />

        {/* Avatar */}
       <Avatar
  src={avatarPreview}
  sx={{
    width: 120,
    height: 120,
    border: '3px solid white',
    position: 'absolute',
    bottom: -60,
    left: 24,
    cursor: 'pointer',
  }}
  onClick={() => avatarInputRef.current?.click()}
 />

<Controller
  name="avatar"
  control={control}
  render={({ field }) => (
    <input
      type="file"
      accept="image/*"
      hidden
      ref={(e) => {
        field.ref(e); // React Hook Form
        avatarInputRef.current = e; // Custom ref for triggering click
      }}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          field.onChange(file); // Gửi file vào react-hook-form
          handleAvatarChange(file); // Để bạn preview ảnh
        }
      }}
    />
  )}
/>

      </Box>

      {/* Form */}
      <Box mt={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên hiển thị
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input field={field} type="text" placeholder={userData?.name ?? ''}
              />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
              Sinh nhật
            </label>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => <Input
                field={{
                  ...field,
                  value: formatDateToInput(field.value), // Date => string
                  onChange: (e) => field.onChange(new Date(e.target.value)), // string => Date
                }} type="date" placeholder='Sinh nhật'
              />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Số Điện thoại
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => <Input
                field={{
                  ...field,
                  value: field.value ?? '', // đảm bảo không undefined
                }}
                type="text"
                placeholder={defaultValues.phone ?? ''}
              />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select {...field} className="border p-2 rounded">
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              )}
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default UserProfileForm;
