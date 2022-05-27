import { useNavigate } from "react-router-dom";
import { Links } from "../../../test_data/roomchatdata";
import { NavBar } from "../../components/navbar/navbar";
import { ChatRoom } from "./chat_room/chat_room";
import  {ChatRoomItem }  from "./chatroom_item/chatroom_item";
import {faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "./create_chat/create_chat";

interface Props {
    username: string,
    image: string,
}


export const Chat:React.FC = () => {
    const navigate = useNavigate();
    let user_info : Props = {username : "walid ben", image : "https://staticg.sportskeeda.com/editor/2022/01/f1c08-16420302985959-1920.jpg"};

    return (
    <main id="chatPage">
        <NavBar />
        <div className='container'>
            <div className="row chat">
                <div className="col-sm-12 col-md-5 col-lg-4 col-xl-3">
                    <div className="chatOptions">
                        <form id="chatSearch">
                            <input type="text" placeholder="Search for chat"/>
                            <FontAwesomeIcon icon={faSearch}/>
                        </form>
                        <button id="newMessage" title="New chat">
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
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
                    {/* <CreateNewChat /> AJJ taddgh ardass kmmlgh */}
                </div>
            </div>
        </div>
    </main>
    );
}