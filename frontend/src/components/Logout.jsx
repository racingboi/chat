import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import "tailwindcss/tailwind.css";

export default function Logout() {
    const navigate = useNavigate();
    const handleClick = async () => {
        const id = await JSON.parse(
            localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
        )._id;
        const data = await axios.get(`${logoutRoute}/${id}`);
        if (data.status === 200) {
            localStorage.clear();
            navigate("/login");
        }
    };
    return (
        <button
            onClick={handleClick}
            className="flex justify-center items-center p-2 rounded-lg bg-purple-500 border-none cursor-pointer"
        >
            <BiPowerOff className="text-xl text-white" />
        </button>
    );
}
