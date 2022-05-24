import React from "react";
import { useNavigate } from "react-router-dom";


const ChatRoomHeader:React.FC = () => {
    return <></>;
}

export const ChatRoom:React.FC = () => {
    const navigate = useNavigate();
    return (
    <section id="chatRoom">
        <ChatRoomHeader/>
    </section>
    );
}