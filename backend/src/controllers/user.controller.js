import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken 
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"something went wrong while generating refesh and access token")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {fullname,email,password}=req.body
    if(
        [fullname,email,password].some((field)=>field?.trim()==="")
    ){
        throw new apiError(400,"Invalid user credentials")
    }

    const existedUser= await User.findOne({
        $or:[{fullname},{email}]
    })

    if (existedUser){
        throw new apiError(409,"User with email/username already exits")
    }

    const user=await User.create({
        fullname,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new apiError(500,"Something went wrong will registering user")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser,"User registerd successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    //console.log(email)

    if (!email){
        throw new apiError(400,"email is required")
    }
    const user= await User.findOne({
        $or:[{email}]
    })
    if (!user){
        throw new apiError(404,"user doesnot exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new apiError(404,"user password incorrect")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken") 
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
           .cookie("accessToken",accessToken,options)
           .cookie("refreshToken",refreshToken,options)
           .json(
            new apiResponse(200,{
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },{new:true})

    const options={        
        httpOnly:true,
        secure:true
    }

    return res.status(200)
              .clearCookie("accessToken",options)
              .clearCookie("refreshToken",options)
              .json(new apiResponse(200,{},"User logged out"))
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    //console.log(incomingRefreshToken)

    if(!incomingRefreshToken){
        throw new apiError(401,"refreshToken not found")
    }

    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN)
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new apiError(401,"invalid refreshToken")
    }
    if(incomingRefreshToken!==user?.refreshToken){
        throw new apiError(401,"refreshToken expired or used")
    }

    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    // console.log(accessToken)
    // console.log(refreshToken)
    return res
           .status(200)
           .cookie("accessToken",accessToken,options)
           .cookie("refreshToken",refreshToken,options)
           .json(
            new apiResponse(
                200,
                {accessToken,refreshToken},
                "accessToken refreshed"
            )
           )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
              .json(new apiResponse(200,req.user,"Current user fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
}