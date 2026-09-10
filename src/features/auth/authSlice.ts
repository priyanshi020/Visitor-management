import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../api/authService';
import type { LoginCredentials, User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const storedToken = localStorage.getItem('vms_token');
const storedUser = localStorage.getItem('vms_user');

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('vms_token', action.payload.token);
        localStorage.setItem('vms_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
