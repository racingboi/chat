import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = JSON.parse(
                    localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
                );
                const response = await axios.post(recieveMessageRoute, {
                    from: data._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat]);

    useEffect(() => {
        const getCurrentChat = async () => {
            try {
                if (currentChat) {
                    await JSON.parse(
                        localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
                    )._id;
                }
            } catch (error) {
                console.error("Failed to get current chat", error);
            }
        };
        getCurrentChat();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        try {
            const data = JSON.parse(
                localStorage.getItem(import.meta.env.VITE_REACT_APP_LOCALHOST_KEY)
            );
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                msg,
            });
            await axios.post(sendMessageRoute, {
                from: data._id,
                to: currentChat._id,
                message: msg,
            });

            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg });
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, [socket]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="grid grid-rows-[10%_80%_10%] gap-0.1 overflow-hidden lg:grid-rows-[15%_70%_15%]">
            <div className="flex justify-between items-center p-8 bg-gray-600">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <img
                            className="h-12"
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt=""
                        />
                    </div>
                    <div className="username">
                        <h3 className="text-white">{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages flex flex-col gap-4 p-8 overflow-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-thumb-rounded-full">
                {messages.map((message) => (
                    <div ref={scrollRef} key={uuidv4()} className={`message flex items-center ${message.fromSelf ? "justify-end" : "justify-start"}`}>
                        <div className={`content max-w-[40%] break-words p-4 text-lg rounded-lg  lg:max-w-[70%] ${message.fromSelf ? "bg-blue-100" : "bg-purple-200"}`}>
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </div>
    );
}
