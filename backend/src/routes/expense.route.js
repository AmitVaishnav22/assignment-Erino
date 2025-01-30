import {Router} from 'express';
import {createExpense, getExpenses, updateExpense, deleteExpense,getExpenseById, getSpendingInsights} from '../controllers/expense.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = Router();


router.route('/createExpense').post(verifyJWT,createExpense)
router.route('/getExpense').get(verifyJWT,getExpenses)
router.route('/getExpense/:id').get(verifyJWT,getExpenseById)
router.route('/updateExpense/:id').put(verifyJWT,updateExpense)
router.route('/deleteExpense/:id').delete(verifyJWT,deleteExpense)
router.route('/getInsights').get(verifyJWT,getSpendingInsights)

export default router;     