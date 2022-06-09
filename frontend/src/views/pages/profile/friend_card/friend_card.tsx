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
			onClick: (username: string) => {
				console.log('accept', username);
			}
		},
		{
			type: friendCardType.request,
			icon: faUserXmark,
			text: 'Decline',
			onClick: (username: string) => {
				console.log('decline', username);
			}
		},
		{
			type: friendCardType.friend,
			icon: faUserMinus,
			text: 'Unfriend',
			onClick: (username: string) => {
				console.log('unfriend', username);
			}
		},
		{
			type: friendCardType.friend,
			icon: faUserSlash,
			text: 'Block',
			onClick: (username: string) => {
				console.log('block', username);
			}
		},
		{
			type: friendCardType.blocked,
			icon: faUserMinus,
			text: 'Unblock',
			onClick: (username: string) => {
				console.log('unblock', username);
			}
		},
		{
			type: friendCardType.pending,
			icon: faUserXmark,
			text: 'Cancle',
			onClick: (username: string) => {
				console.log('cancel', username);
			}
		}
	];

	return (
		<div className="friendCard">
			<div className="friendInfos" onClick={() => {}}>
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
							<button key={index} className={`btn${button.text}`} onClick={() => button.onClick(Props.username)}>
								<FontAwesomeIcon icon={button.icon} />
								{button.text}
							</button>
						);
					}
				})}
			</div>
		</div>)
}
