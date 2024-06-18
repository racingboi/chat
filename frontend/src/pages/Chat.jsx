import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import { Welcome } from "../components/Welcome";
import "tailwindcss/tailwind.css";

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        async function fetchCurrentUser() {
            if (!localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
                    )
                );
            }
        }
        fetchCurrentUser();
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchContacts() {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data);
                } else {
                    navigate("/setAvatar");
                }
            }
        }
        fetchContacts();
    }, [currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-4 bg-gray-900">
            <div className="h-[85vh] w-[85vw] bg-black bg-opacity-70 grid grid-cols-[25%_75%] md:grid-cols-[35%_65%]">
                <Contacts contacts={contacts} changeChat={handleChatChange} />
                {currentChat === undefined ? (
                    <Welcome />
                ) : (
                    <ChatContainer currentChat={currentChat} socket={socket} />
                )}
            </div>
        </div>
    );
}
