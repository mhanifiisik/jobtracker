import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState, User, AuthResponse } from '../../api/auth-type'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null
}

// Define auth API calls
const authApi = {
  signIn: (credentials: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signin', credentials),

  signUp: (userData: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/signup', userData),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  getProfile: () => api.get<User>('/auth/profile')
}

// Async thunks for authentication actions
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.signIn(credentials)
      const data = response.data

      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to sign in')
      }
      return rejectWithValue((error as Error).message || 'Failed to sign in')
    }
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.signUp(userData)
      const data = response.data

      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to sign up')
      }
      return rejectWithValue((error as Error).message || 'Failed to sign up')
    }
  }
)

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as { auth: AuthState }

    if (!auth.refreshToken) {
      return rejectWithValue('No refresh token available')
    }

    try {
      const response = await authApi.refreshToken(auth.refreshToken)
      const data = response.data

      // Update localStorage
      localStorage.setItem('accessToken', data.accessToken)

      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to refresh token')
      }
      return rejectWithValue((error as Error).message || 'Failed to refresh token')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile()
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch profile')
      }
      return rejectWithValue((error as Error).message || 'Failed to fetch profile')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      // Clear all auth data
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload
        state.user = user
        state.accessToken = accessToken
        state.refreshToken = refreshToken
        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload
        state.user = user
        state.accessToken = accessToken
        state.refreshToken = refreshToken
        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Refresh Token
    builder
      .addCase(refreshAuthToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.isLoading = false
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // On refresh token failure, log the user out
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { signOut, setCredentials, clearError } = authSlice.actions

export default authSlice.reducer
