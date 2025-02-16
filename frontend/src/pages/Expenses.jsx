import { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, deleteExpense } from "../store/expenseSlice.js";
import ExpenseForm from "./ExpenseForm.jsx";

const ExpenseList = () => {
    const dispatch = useDispatch();
    const expenses  = useSelector(state => state.expenses.expenses);
    console.log(expenses)
    const userData=useSelector(state => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    console.log("userData",userData);
    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Expenses</h2>

            {/* Add Expense Button */}
            <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                + Add Expense
            </button>

            <ul className="space-y-3">
                {expenses.map(expense => (
                    <li key={expense._id} className="bg-gray-100 p-3 flex justify-between">
                        <div>
                            <p className="font-semibold">{expense.title} - ${expense.amount}</p>
                            <p className="text-sm">{expense.category}</p>
                        </div>
                        <button onClick={() => dispatch(deleteExpense(expense._id))}
                            className="text-red-500 font-bold">X</button>
                    </li>
                ))}
            </ul>

            {/* Modal for Expense Form */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <ExpenseForm onClose={() => setIsOpen(false)} /> {/* Use your existing form */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
