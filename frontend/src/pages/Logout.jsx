import React from 'react'
import { logoutUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
export default function Logout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser()); // Dispatch logout action
        navigate("/login"); // Redirect to login page
    };
    return (
        <button onClick={handleLogout} className='text-white bg-black'>Logout</button>
    )
}
