import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({ fullname: "", email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector(state => state.auth.error); // Get error from Redux

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log(user)
        const result = await dispatch(signupUser(user));

        if (signupUser.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-3">Register</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
            <form onSubmit={handleRegister} className="space-y-3">
                <input type="text" placeholder="Name" className="w-full border p-2"
                    onChange={(e) => setUser({ ...user, fullname: e.target.value })} required />
                <input type="email" placeholder="Email" className="w-full border p-2"
                    onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                <input type="password" placeholder="Password" className="w-full border p-2"
                    onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
