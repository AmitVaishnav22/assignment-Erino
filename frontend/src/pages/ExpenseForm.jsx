import React from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../store/expenseSlice.js"

function ExpenseForm({onClose}) {
    const dispatch = useDispatch();
    const [expense, setExpense] = useState({ title: "", amount: "", category: "", description: "" });
    const handleAddExpense = async (e) => {
        e.preventDefault();
        await dispatch(addExpense(expense));
        setExpense({ title: "", amount: "", category: "", description: "" });
        onClose(); // Close modal after adding
    };

    return (
        <form onSubmit={handleAddExpense} className="space-y-3">
            <input type="text" placeholder="Title" className="w-full border p-2"
                value={expense.title} onChange={(e) => setExpense({ ...expense, title: e.target.value })} required />
            <input type="number" placeholder="Amount" className="w-full border p-2"
                value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} required />
            <input type="text" placeholder="Category" className="w-full border p-2"
                value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })} required />
            <textarea placeholder="Description" className="w-full border p-2"
                value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })}></textarea>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Expense</button>
        </form>
    );
}

export default ExpenseForm