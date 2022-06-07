import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import {faClockRotateLeft} from "@fortawesome/free-solid-svg-icons";
import { DefaultGame, UltimateGame } from '../../../../assets';
import {faCheck, faBan, faXmark ,  faUserSlash} from "@fortawesome/free-solid-svg-icons";

interface Props {
	type: number,
	image: string,
	username: string,

}

export const Itemfriend = (Props : Props) => {
	return (
			<div className="item">
				<div className="image">
					<CircleAvatar avatarURL={Props.image} dimensions={80}/>
				</div>
				<div className="username">
					<span>{Props.username} </span>
				</div>
				<div className="buttons">

					{ (Props.type === 1) &&
						<button className="cancel">
						<FontAwesomeIcon icon={faUserSlash}/>
						Unfriend
					</button>
					}
					{ (Props.type === 1) &&
						<button className="cancel">
						<FontAwesomeIcon icon={faBan}/>
						Block
					</button>
					}
					{ (Props.type === 2) &&
						<button className="accept">
							<FontAwesomeIcon icon={faCheck}/>
							Accept
						</button>
					}
					{ (Props.type === 2) &&
						<button className="cancel">
						<FontAwesomeIcon icon={faXmark}/>
						Cancel
					</button>
					}
					{ (Props.type === 3) &&
						<button className="cancel">
						<FontAwesomeIcon icon={faXmark}/>
						Unblock
					</button>
					}
					{ (Props.type === 4) &&
						<button className="cancel">
						<FontAwesomeIcon icon={faXmark}/>
						Cancel
					</button>
					}
				</div>
			</div>
		)
}
