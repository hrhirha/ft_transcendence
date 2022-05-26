import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faTrashCan, faPaperPlane} from "@fortawesome/free-solid-svg-icons";


interface Props {
    username: string,
    image: string,
    status: string,
    
}

const ChatRoomHeader = (Props : Props) => {
    return (
    <div id="chatRoomHeader">
        <div className="img">
            <CircleAvatar avatarURL={Props.image} dimensions={50}/>
        </div>
        <div className='dataColumn'>
            <div className='dataRow'>
                <span className='userName'>{Props.username}</span>
                <span className='status'>{Props.status}</span>
            </div>
            <div className='dataRow'>
                <div className="options">
                    <div className="icon_search">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </div>
                    <div className="icon_delete">
                        <FontAwesomeIcon icon={faTrashCan}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

const ChatRoomBody:React.FC = () => {
    return <div id="chatRoomBody">
        Body
        chat
    </div>;
}


const ChatRoomFooter:React.FC = () => {
    return <div id="chatRoomFooter">
       <form>
            <input type="text" placeholder="Type your Message Here"/>
            <div className="icon">
                <FontAwesomeIcon icon={faPaperPlane}/>
            </div>
        </form>
    </div>;
}

export const ChatRoom:React.FC = () => {
    const navigate = useNavigate();
    return (
    <section id="chatRoom">
        <ChatRoomHeader username="Jhon don" image="https://staticg.sportskeeda.com/editor/2022/01/f1c08-16420302985959-1920.jpg" status="last seen yesterday 2.30 PM"/>
        <ChatRoomBody/>
        <ChatRoomFooter/>
    </section>
    );
}