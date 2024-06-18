import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import "tailwindcss/tailwind.css";

export default function Register() {
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same.", toastOptions);
            return false;
        } else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters.", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("Password should be equal or greater than 8 characters.", toastOptions);
            return false;
        } else if (email === "") {
            toast.error("Email is required.", toastOptions);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { email, username, password } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
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
                navigate("/");
            }
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-900">
                <form
                    className="flex flex-col gap-8 bg-black bg-opacity-60 p-12 rounded-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center justify-center gap-6">
                        <img src={Logo} alt="logo" className="h-20" />
                        <h1 className="text-white uppercase">snappy</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        className="bg-transparent p-4 border border-purple-500 rounded-lg text-white text-lg focus:border-purple-700 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-purple-500 text-white p-4 rounded-lg font-bold text-lg uppercase hover:bg-purple-700 transition-colors"
                    >
                        Create User
                    </button>
                    <span className="text-white uppercase">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-500 font-bold">
                            Login.
                        </Link>
                    </span>
                </form>
            </div>
        </>
    );
}
