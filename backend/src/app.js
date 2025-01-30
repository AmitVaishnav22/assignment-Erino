import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())    

import userRouter from "./routes/user.routes.js"
import expenseRouter from "./routes/expense.route.js"
import healthCheckRouter from "./routes/healthcheck.route.js"

app.use("/api/v1/healthcheck", healthCheckRouter)  // health check route 
app.use("/api/v1/users",userRouter)
app.use("/api/v1/expenses",expenseRouter) 

export {app}   