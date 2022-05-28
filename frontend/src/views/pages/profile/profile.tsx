import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { NavBar } from "../../components/navbar/navbar";
import {faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
                            <div className="btn_SendMsg">
                            <FontAwesomeIcon icon={faPlus}/>
                                <span>Send Message</span>
                            </div>
                        </div>
                    </div>
                    <div className=" col-sm-12 col-md-7 col-lg-8">
                        <div className="profile_info">
                            match history
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    );
}