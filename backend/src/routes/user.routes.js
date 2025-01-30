import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { registerUser,loginUser,getCurrentUser,refreshAccessToken,logoutUser } from "../controllers/user.controller.js";
const router = Router();


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/refresh').post(refreshAccessToken)
router.route('/current').get(verifyJWT, getCurrentUser)
router.route('/logout').post(verifyJWT, logoutUser)


export default router;