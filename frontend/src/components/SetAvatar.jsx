import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../assets/loader.gif";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import "tailwindcss/tailwind.css";

export default function SetAvatar() {
    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        if (!localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY))
            navigate("/login");
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(
                localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
            );

            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(
                    import.meta.env.VITE_REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(user)
                );
                navigate("/");
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    };

    useEffect(() => {
        async function fetchAvatars() {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const base64Image = btoa(response.data);
                data.push(base64Image);
            }
            setAvatars(data);
            setIsLoading(false);
        }
        fetchAvatars();
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
                    <img src={loader} alt="loader" className="w-full" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-12 bg-gray-900 h-screen w-screen">
                    <div className="text-center">
                        <h1 className="text-white">Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="flex gap-8">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`border-4 p-2 rounded-full flex justify-center items-center transition duration-500 ease-in-out ${
                                        selectedAvatar === index ? "border-purple-500" : "border-transparent"
                                    }`}
                                    onClick={() => setSelectedAvatar(index)}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        className="h-24 transition duration-500 ease-in-out cursor-pointer"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={setProfilePicture}
                        className="bg-purple-500 text-white py-2 px-8 rounded-lg font-bold text-lg uppercase hover:bg-purple-600"
                    >
                        Set as Profile Picture
                    </button>
                </div>
            )}
        </>
    );
}
