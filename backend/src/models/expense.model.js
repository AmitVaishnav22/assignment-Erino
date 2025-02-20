import mongoose,{Schema} from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        required: true
    },
    amount: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String
    },
  }, { timestamps: true });

export const Expense = mongoose.model("Expense", ExpenseSchema);
  