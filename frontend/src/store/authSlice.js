import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Login User
export const loginUser = createAsyncThunk("auth/login", async (userData) => {
    const response = await axios.post("/api/v1/users/login", userData);
    localStorage.setItem("token", response.data.accessToken);
    return response.data;
});

// Signup User
export const signupUser = createAsyncThunk("auth/register", async (userData) => {
    const response = await axios.post("/api/v1/users/register", userData);
    return response.data;
});

// Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token"); // Remove token
    return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: localStorage.getItem("token") || null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.token = action.payload.data.accessToken;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload.data;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            });
    }
});

export default authSlice.reducer;
  