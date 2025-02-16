import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector(state => state.auth.error); // Get error from Redux

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(user));

        if (loginUser.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-3">Login</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
            <form onSubmit={handleLogin} className="space-y-3">
                <input type="email" placeholder="Email" className="w-full border p-2"
                    onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                <input type="password" placeholder="Password" className="w-full border p-2"
                    onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
