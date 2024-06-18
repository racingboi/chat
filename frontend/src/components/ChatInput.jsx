import React, {useEffect, useRef, useState} from "react";
import { BsEmojiSmile} from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
export default function ChatInput({ handleSendMsg }) {
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const emojiPickerRef = useRef(null);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };


    const handleEmojiClick = (emojiObject) => {
        setMsg((prevMessage)=>(prevMessage += emojiObject.emoji));
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.id !== 'emoji-picker') {
                if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                    setShowEmojiPicker(false);
                }
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);


    return (
        <div className="grid items-center grid-cols-[5%_90%] bg-gray-800 p-8 lg:p-4 gap-6 ">
            <div className="flex items-center text-white gap-6 relative">
                <BsEmojiSmile
                    className="text-panel-header-icon cursor-pointer text-xl"
                    onClick={handleEmojiPickerhideShow}
                    id={"emoji-picker"}
                />
                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute top-[-500px] bg-gray-800 shadow-md border border-purple-500"
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme={'dark'}/>
                    </div>
                )}
            </div>
            <form className="flex items-center w-full gap-4 bg-white/20 p-2 rounded-full "
                  onSubmit={(event) => sendChat(event)}>
                <input
                    type="text"
                    placeholder="Type your message here"
                    className="w-full bg-transparent text-white border-none pl-4 text-lg focus:outline-none"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit" className="flex justify-center items-center bg-purple-500 p-2 rounded-full">
                    <IoMdSend className="text-2xl text-white" />
                </button>
            </form>
        </div>
    );
}
