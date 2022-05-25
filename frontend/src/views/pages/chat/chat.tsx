import React from "react";
import { useNavigate } from "react-router-dom";
import { Links } from "../../../test_data/roomchatdata";
import { NavBar } from "../../components/navbar/navbar";
import { ChatRoom } from "./chat_room/chat_room";
import  {ChatRoomItem }  from "./chatroom_item/chatroom_item";


export const Chat:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="chatPage">
        <NavBar />
        <div className='container'>
            <div className="row chat">
                <div className="col-sm-12 col-md-5 col-lg-4 col-xl-3">
                    <div className="chatSearch">
                        search input
                    </div>
                    <div className="chatOptions">
                        creat new chat, creat group
                        icons 
                    </div>
                    <div className="chatRooms">
                        { Links && Links.map (({username, image, last_msg, time_last_msg, nbr_msg_not_read}, k ) => (
                                <ChatRoomItem
                                    key={k}
                                    active={k === 2}
                                    username={username}
                                    image={image}
                                    last_msg={last_msg}
                                    time_last_msg={time_last_msg}
                                    nbr_msg_not_read={nbr_msg_not_read}
                                />
                        ))}
                    </div>
                </div>
                <div className="col">
                    <ChatRoom />
                </div>
            </div>
        </div>
    </main>
    );
}