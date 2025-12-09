import { UseDecodeToken } from '../hooks/authHook';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDecodedToken } from '../type/type';
import { RootState } from '.';

function checkLogin(): boolean {
    const token: string | null = localStorage.getItem('token');
    if (token !== null) {
      const decodedToken: IDecodedToken | null = UseDecodeToken(token);
      return !!decodedToken;
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
