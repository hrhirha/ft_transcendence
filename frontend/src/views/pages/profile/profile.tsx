import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { NavBar } from "../../components/navbar/navbar";
import {faMessage, faUserPlus , faBan, faClockRotateLeft,faUserGroup} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Match_data } from "../../../test_data/matchs_data";
import { Item } from "./item_match_history/item";
import { frinds_data } from "../../../test_data/frinds_data";
import { Itemfriend } from "./item_friendstatus/item";

interface Props {
    type: string,
}

export const Btns = (Props: Props) => {

    return (
            <div className="btns">
            { (Props.type == "Me") && 
                <button className="btn_friends">
                    <FontAwesomeIcon icon={faUserGroup}/>
                    friends
                </button>
            }
            { (Props.type == "Me") && 
                <button className="btn_match_history">
                    <FontAwesomeIcon icon={faClockRotateLeft}/>
                    Match History
                </button>
            }
            {(Props.type == "user") && 
                <button className="btn_add">
                    <FontAwesomeIcon icon={faUserPlus}/>
                    Add friend
                </button>
            }
            {(Props.type == "user") && 
                <button className="btn_SendMsg">
                    <FontAwesomeIcon icon={faMessage}/>
                    Send Message
                </button>
            }
            {(Props.type == "user") && 
                <button className="btn_block">
                    <FontAwesomeIcon icon={faBan}/>
                    Block
                </button>
            }
        </div>)
}
export const Profile:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="profilePage">
        <NavBar />
        <div className="profil">
            <div className='container'>
                <div className="row">
                    <div className="col-sm-12 col-md-5 col-lg-4">
                        <div className="profile_info">
                            <div className="image">
                                <CircleAvatar avatarURL="https://staticg.sportskeeda.com/editor/2022/01/f1c08-16420302985959-1920.jpg" dimensions={190}/>
                            </div>
                            <span className="username"> walid ben</span>
                            <span className="path">@waxben</span>
                            <div className="status">
                                <div className="item_stat">
                                    <span className="stat">Win</span>
                                    <span className="value">30</span>
                                </div>
                                <div className="vl"></div>
                                <div className="item_stat">
                                    <span className="stat">Ranck</span>
                                    <span className="value">32</span>
                                </div>
                                <div className="vl"></div>
                                <div className="item_stat">
                                    <span className="stat"> Lose</span>
                                    <span className="value">15</span>
                                </div>
                            </div>
                        </div>

                        
                        <Btns type={"user"}/>
                        


                    </div>
                    <div className=" col-sm-12 col-md-7 col-lg-8">

                        <div className="friends">
                            <div className="status_friends">
                                <button className="btn_friends">
                                    <FontAwesomeIcon icon={faUserGroup}/>
                                    Friends
                                </button>
                                <button className="btn_match_history">
                                    <FontAwesomeIcon icon={faClockRotateLeft}/>
                                    Requests
                                </button>
                                <button className="btn_friends">
                                    <FontAwesomeIcon icon={faUserGroup}/>
                                    Ignore
                                </button>
                                <button className="btn_match_history">
                                    <FontAwesomeIcon icon={faClockRotateLeft}/>
                                    Request Sended
                                </button>
                            </div>
                            <div className="content">
                                <div className="items">
                                { frinds_data && frinds_data.map (({type, image, username}, k ) => (
                                    <Itemfriend
                                        key={k}
                                        type = {type}
                                        image = {image}
                                        username = {username} />
                                ))}
                                </div>
                            </div>
                        </div>

                       {/* <div className="match_history">
                            <div className="Titile">
                                <FontAwesomeIcon icon={faClockRotateLeft}/>
                                <h2>match history</h2>
                            </div>
                            <div className="matchs">
                                <div className="items_match">
                                    { Match_data && Match_data.map (({user1, image_user1, user2, image_user2, score, status, typegame, time}, k ) => (
                                        <Item
                                            key={k}
                                            user1 = {user1}
                                            image_user1 = {image_user1}
                                            user2 = {user2}
                                            image_user2 = {image_user2}
                                            score = {score}
                                            status = {status}
                                            typegame = {typegame}
                                            time = {time} />
                                    ))}
                                </div>  
                            </div>
                        </div>*/}


                    </div>
                </div>
            </div>
        </div>
    </main>
    );
}