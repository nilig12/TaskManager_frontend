


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "./authService";

const user = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
    user,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// REGISTER
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            return await authService.registerUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// LOGIN
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            return await authService.loginUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.user = action.payload.user;

                // ✅ Store tokens separately
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.user = action.payload.user;

                // ✅ Store tokens separately
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);

                console.log("Token stored:", action.payload.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            });
    },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;