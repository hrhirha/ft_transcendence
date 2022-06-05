import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import {faClockRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { DefaultGame, UltimateGame } from '../../../../assets';
import {faCheck, faBan, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
	type: number,
	image: string,
	username: string,

}

export const Itemfriend = (Props : Props) => {
	if(Props.type == 1)
	{
		return (
			<div className="item">
				<div className="image">
					<CircleAvatar avatarURL={Props.image} dimensions={50}/>
				</div>
				<div className="username">
					<span>{Props.username} </span>
				</div>
				<div className="buttons">
					<button className="accept">
						<FontAwesomeIcon icon={faCheck}/>
					</button>
					<button className="ban">
						<FontAwesomeIcon icon={faBan}/>
					</button>
					<button className="accept">
						<FontAwesomeIcon icon={faXmark}/>
					</button>
				</div>
			</div>
		)
	}
	return (
		<div className="item">
		</div>
	)
}
