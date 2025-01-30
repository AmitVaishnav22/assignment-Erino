import {Expense} from "../models/expense.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createExpense = asyncHandler(async(req,res)=>{
    const {title,amount,category,description}=req.body

    if (!title?.trim() || !category?.trim() || !description?.trim() || amount == null) {
        throw new apiError(400, "Invalid expense details");
    }
    const expense=await Expense.create({
        title,
        amount,
        category,
        description,
        userId:req.user._id
    })

    return res.status(201).json(
        new apiResponse(
        200,
        expense,
        "Expense created successfully",
        )
    )
})


const getExpenses = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, category, startDate, endDate } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const filter = { userId: req.user._id }; 

        if (category) {
            filter.category = category;
        }
        if (startDate && endDate) {
            filter.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }
        const expenses = await Expense.find(filter)
            .sort({ date: -1 }) 
            .skip((pageNumber - 1) * limitNumber) 
            .limit(limitNumber); 

        const total = await Expense.countDocuments(filter);
        const data={expenses, total, pageNumber, totalPages: Math.ceil(total / limitNumber) }

        return res.status(201).json(
            new apiResponse(
            200,
            data,
            "Expense fetched successfully",
            )
        )
    } catch (error) {
        throw new apiError(500, "Internal Server Error");
    }
});

const getExpenseById = asyncHandler(async (req, res) => {

        const { id } = req.params; 
        const expense = await Expense.findById(id);

        if (!expense) {
            throw new apiError(404, "Expense not found");
        }

        return res.status(201).json(
            new apiResponse(
            200,
            expense,
            "Expense fetched successfully",
            )
        )
});


const updateExpense = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, date, description } = req.body;
        const expense = await Expense.findByIdAndUpdate(id, { title, amount, category, date, description }, { new: true });
        
        if (!expense) {
            throw new apiError(404, "Expense not found");
        }
        
        return res.status(201).json(
            new apiResponse(
            200,
            expense,
            "Expense updated successfully",
            )
        )
    } catch (error) {
        throw new apiError(500, "Internal Server Error");
    }
})


const deleteExpense = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete({ _id: id,userId: req.user.id });
        
        if (!expense) {
            throw new apiError(404, "Expense not found");
        }
        
        return res.status(201).json(
            new apiResponse(
            200,
            "Expense deleted successfully",
            )
        )
    } catch (error) {
        throw new apiError(500, "Internal Server Error");
    
    }
})

const getSpendingInsights = asyncHandler(async (req, res) => {
    try {
        const expenses = await Expense.aggregate([
            {
            $match: { 
                userId: req.user._id 
                },
            },
            {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" },
                }
            },
            {
             $sort: { 
                totalAmount: -1
                },
            } 
        ])
    const totalSpendings=expenses.reduce((sum, category) => sum + category.totalAmount, 0);
    const insights = expenses.map(category => ({
        category: category._id,
        totalAmount: category.totalAmount,
        percentage: ((category.totalAmount / totalSpendings) * 100).toFixed(2) + "%",
      }));
    return res.status(201).json(
        new apiResponse(
        200,
        insights,
        "Spending insights fetched successfully",
        )
    )
    } catch (error) {  
        throw new apiError(500, "Internal Server Error");
    }
})

export { createExpense,
         getExpenses,
         updateExpense,
        deleteExpense,
        getExpenseById,
        getSpendingInsights
    };