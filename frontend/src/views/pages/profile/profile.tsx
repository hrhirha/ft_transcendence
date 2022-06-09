import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { NavBar } from "../../components/navbar/navbar";
import {faMessage, faUserPlus , faBan, faClockRotateLeft,faUserGroup} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { frinds_data } from "../../../test_data/frinds_data";
import { FriendCard } from "./friend_card/friend_card";
import { FriendsManager } from "./friends_manager/friends_manager";
import { ProfileInfos } from "./profile_infos/profile_infos";


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
                    <div className="col col-md-10 col-lg-8">
                        {/* <div className="profile_info">
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
                        <Btns type={"user"}/> */}
                        <ProfileInfos avatar="https://avatars.githubusercontent.com/u/74456446?v=4" fullName="Walid Ben Said" username="wben-sai" ranking={2} wins={10}/>
                    </div>
                    <div className="col col-md-10 col-lg-8">
                        <FriendsManager />
                    </div>
                </div>
        </div>
    </main>
    );
}

 /* <div className="match_history">
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
</div>*/