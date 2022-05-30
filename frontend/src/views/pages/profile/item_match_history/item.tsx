import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import {faClockRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { DefaultGame, UltimateGame } from '../../../../assets';


interface Props {
    user1: string,
    image_user1: string,
    user2: string,
    image_user2: string,
    score: string,
    status: string,
    typegame: string,
    time: string,
}

export const Item = (Props : Props) => {
  return (
        <div className="item">
            <div className="info_users">
                <div className="image_user1">
                    <CircleAvatar avatarURL={Props.image_user1} dimensions={50}/>
                </div>
                <div className="status_score">
                    <span className={(Props.status === 'win') ? "win" : "lose"}>{Props.status}</span>
                    <span className="score"> {Props.score}</span>
                </div>
                <div className="image_user2">
                    <CircleAvatar avatarURL={Props.image_user2} dimensions={50}/>
                    <div className="line"></div>
                </div>
            </div>
            <div className="game_info">
                <div className="game">
                    <img width={50} src={(Props.typegame != "normal")? UltimateGame : DefaultGame} />
                </div>
                <div className="time_typegame">
                    <span className="name">{Props.typegame}</span>
                    <span className="time">{Props.time}</span>
                </div>
            </div>
        </div>
  )
}
