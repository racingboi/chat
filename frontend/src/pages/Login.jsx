import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import "tailwindcss/tailwind.css";

export const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: "", password: "" });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    useEffect(() => {
        if (localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { username, password } = values;
        if (username === "" || password === "") {
            toast.error("Username and Password are required.", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem(
                    import.meta.env.VITE_REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(data.user)
                );
                toast("Logged in successfully", toastOptions);

                navigate("/");
            }
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-900">
                <form
                    className="flex flex-col gap-8 bg-black bg-opacity-60 p-20 rounded-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center justify-center gap-4">
                        <img src={Logo} alt="logo" className="h-20" />
                        <h1 className="text-white uppercase">snappy</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                        min="3"
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-purple-500 text-white p-4 rounded-lg font-bold text-lg uppercase hover:bg-purple-700 transition-colors"
                    >
                        Log In
                    </button>
                    <span className="text-white uppercase">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-500 font-bold">
                            Create One.
                        </Link>
                    </span>
                </form>
            </div>
        </>
    );
};
