import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/v1/expenses"; // Base API URL

const loadExpenses = () => {
    const storedExpenses = localStorage.getItem("expenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
};

// Fetch Expenses
export const fetchExpenses = createAsyncThunk("expenses/fetchAll", async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(API_URL/getExpense, { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
});

// Add Expense
export const addExpense = createAsyncThunk("expenses/add", async (expenseData, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.post(API_URL+"/createExpense", expenseData, { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
});

// Delete Expense
export const deleteExpense = createAsyncThunk("expenses/delete", async (id, { getState }) => {
    const token = getState().auth.token;
    await axios.delete(`${API_URL}/deleteExpense/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
    }); 
    return id;
});

const expenseSlice = createSlice({
    name: "expenses",
    initialState: {  expenses: loadExpenses() },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload.data;
                localStorage.setItem("expenses", JSON.stringify(action.payload.data));
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenses.push(action.payload.data);
                localStorage.setItem("expenses", JSON.stringify(state.expenses));
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
                localStorage.setItem("expenses", JSON.stringify(state.expenses));
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export default expenseSlice.reducer;
