import { useEffect, useState } from "react";
import Robot from "../assets/robot.gif";
import "tailwindcss/tailwind.css";

export const Welcome = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function fetchUserName() {
            const user = await JSON.parse(
                localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
            );
            setUserName(user?.username);
        }
        fetchUserName();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-white">
            <img src={Robot} alt="" className="h-80" />
            <h1 className="text-3xl">
                Welcome, <span className="text-purple-500">{userName}!</span>
            </h1>
            <h3 className="text-lg mt-2">Please select a chat to start messaging.</h3>
        </div>
    );
}
