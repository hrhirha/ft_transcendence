import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import {faUserSlash, faUserCheck, faUserMinus, faUserXmark} from "@fortawesome/free-solid-svg-icons";


enum friendCardType {
	friend = 1,
	request = 2,
	blocked = 3,
	pending = 4
}

interface Props {
	type: friendCardType,
	avatar: string,
	fullName: string,
	username: string,
	ranking: number
}

export const FriendCard = (Props : Props) => {
	const buttons = [
		{
			type: friendCardType.request,
			icon: faUserCheck,
			text: 'Accept',
		},
		{
			type: friendCardType.request,
			icon: faUserXmark,
			text: 'Decline',
		},
		{
			type: friendCardType.friend,
			icon: faUserXmark,
			text: 'Unfriend',
		},
		{
			type: friendCardType.friend,
			icon: faUserSlash,
			text: 'Block',
		},
		{
			type: friendCardType.blocked,
			icon: faUserMinus,
			text: 'Unblock',
		},
		{
			type: friendCardType.pending,
			icon: faUserXmark,
			text: 'Cancle',
		}
	];

	return (
		<div className="friendCard">
			<div className="friendInfos">
				<div className='avatar'>
					<CircleAvatar avatarURL={Props.avatar} dimensions={85}/>
					<span className='ranking'>
						{Props.ranking}
					</span>
				</div>
				<h6>{Props.fullName} </h6>
				<span>@{Props.username} </span>
			</div>
			<div className="buttons">
				{buttons.map((button, index) => {
					if (button.type === Props.type) {
						return (
							<button key={index} className={`btn${button.text}`}>
								<FontAwesomeIcon icon={button.icon} />
								{button.text}
							</button>
						);
					}
				})}
			</div>
		</div>)
}
