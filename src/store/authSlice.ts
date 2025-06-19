import { UseDecodeToken } from '../hooks/authHook';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IDecodedToken } from '../type/type';
import { RootState } from '.';
import { refreshTokenService } from '../services/authService';
import { jwtDecode } from "jwt-decode";
import { UseCheckExpirationToken } from "../hooks/authHook";

function checkLogin(): boolean {
    const token: string | null = localStorage.getItem('token');
    if (token !== null) {
      const decodedToken: IDecodedToken | null = UseDecodeToken(token);
      return !!decodedToken; // Sử dụng !! để chuyển đổi giá trị thành kiểu boolean
    }
    return false;
  }


interface IAuthState {
  isAuth: boolean;
}

const initialState: IAuthState = {
  isAuth: checkLogin(),
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuthState>) => {
      state.isAuth = action.payload.isAuth
    }
  },
});

export const {
  setAuth
} = authSlice.actions;

export const isAuth = (state: RootState): boolean => state.auth.isAuth

export default authSlice.reducer;
