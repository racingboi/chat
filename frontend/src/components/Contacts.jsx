import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import "tailwindcss/tailwind.css";

export default function Contacts({ contacts, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        async function fetchUserData() {
            const data = await JSON.parse(
                localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
            );
            setCurrentUserName(data.username);
            setCurrentUserImage(data.avatarImage);
        }
        fetchUserData();
    }, []);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <>
            {currentUserImage && currentUserName && (
                <div className="grid grid-rows-[10%_75%_15%] overflow-hidden bg-gray-800">
                    <div className="flex items-center gap-4 justify-center">
                        <img src={Logo} alt="logo" className="h-8" />
                        <h3 className="text-white uppercase">snappy</h3>
                    </div>
                    <div className="flex flex-col items-center overflow-auto gap-2.5 scrollbar-thin scrollbar-thumb-white/25 scrollbar-thumb-rounded">
                        {contacts.map((contact, index) => (
                            <div
                                key={contact._id}
                                className={`flex items-center gap-4 p-2.5 w-[90%] bg-white/20 min-h-[5rem] cursor-pointer rounded-md transition-all ease-in-out duration-500 ${
                                    index === currentSelected ? "bg-purple-600" : ""
                                }`}
                                onClick={() => changeCurrentChat(index, contact)}
                            >
                                <div className="avatar">
                                    <img
                                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                        alt=""
                                        className="h-12"
                                    />
                                </div>
                                <div className="username">
                                    <h3 className="text-white">{contact.username}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-8 bg-gray-800 border">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currentUserImage}`}
                                alt="avatar"
                                className="h-16 max-w-full"
                            />
                        </div>
                        <div className="username">
                            <h2 className="text-white">{currentUserName}</h2>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
