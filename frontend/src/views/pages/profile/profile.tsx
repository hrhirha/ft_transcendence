import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { NavBar } from "../../components/navbar/navbar";
import {faMessage, faUserPlus , faBan, faClockRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Match_data } from "../../../test_data/matchs_data";
import { Item } from "./item_match_history/item";

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
                        <div className="btns">
                            <div className="btn_status">
                                <FontAwesomeIcon icon={faUserPlus}/>
                                <span>Add friend</span>
                            </div>
                            <div className="line"></div>
                            <div className="btn_SendMsg">
                                <FontAwesomeIcon icon={faMessage}/>
                                <span>Send Message</span>
                            </div>
                        </div>
                        <div className="btnBlock">
                            <div className="btn_SendMsg">
                                <FontAwesomeIcon icon={faBan}/>
                                <span>Block</span>
                            </div>
                        </div>
                    </div>
                    <div className=" col-sm-12 col-md-7 col-lg-8">
                        <div className="match_history">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    );
}