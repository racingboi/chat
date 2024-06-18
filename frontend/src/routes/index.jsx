import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register.jsx";
import { Login } from "../pages/Login.jsx";
import SetAvatar from "../components/SetAvatar.jsx";
import Chat from "../pages/Chat.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
            <Route path="/" element={<Chat />} />
        </Routes>
    );
};
