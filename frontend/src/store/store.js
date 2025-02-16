import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js"
import expenseSlice from "./expenseSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        expenses: expenseSlice,
    },
});
