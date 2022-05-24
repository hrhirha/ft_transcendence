import React from "react";
import { useNavigate } from "react-router-dom";
import { Links } from "../../../test_data/roomchatdata";
import { NavBar } from "../../components/navbar/navbar";
import  {Item_chatroom}  from "../../components/item_chatroom/item_chatroom";


export const Chat:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="chatPage">
        <NavBar />
        <div className="chat">
            <div className='container chat-container'>
                <div className="row chat-row">
                    <div className="col-sm-12 col-md-5 col-lg-4">
                        <div className="col"></div>
                        <div className="col"></div>
                            { Links && Links.map (({username, image, last_msg, time_last_msg, nbr_msg_not_read} ) => (
                                 <Item_chatroom username={username} image={image} last_msg={last_msg} time_last_msg={time_last_msg} nbr_msg_not_read={nbr_msg_not_read} />
                            ))}
                    </div>
                    <div className="col-sm-12 col-md-7 col-lg-8 lst_msg">sdfs</div>
                </div>
            </div>
        </div>
    </main>
    );
}