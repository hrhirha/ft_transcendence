import React from "react";
import { useNavigate } from "react-router-dom";


const ChatRoomHeader:React.FC = () => {
    return <div id="chatRoomHeader">
        Header
        group or user name and avatar
        options
            -delete chat
            -clear chat
            -...
    </div>;
}

const ChatRoomBody:React.FC = () => {
    return <div id="chatRoomBody">
        Body
        chat
    </div>;
}


const ChatRoomFooter:React.FC = () => {
    return <div id="chatRoomFooter">
        Footer
        message imput and button send
    </div>;
}

export const ChatRoom:React.FC = () => {
    const navigate = useNavigate();
    return (
    <section id="chatRoom">
        <ChatRoomHeader/>
        <ChatRoomBody/>
        <ChatRoomFooter/>
    </section>
    );
}