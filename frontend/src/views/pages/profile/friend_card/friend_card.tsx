import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import { buttons, userType } from '../profile'

interface Props {
	type: userType,
	avatar: string,
	fullName: string,
	username: string,
	ranking: number
}

export const FriendCard = (Props : Props) => {
	return (
		<div className="friendCard">
			<div className="friendInfos" onClick={() => {}}>
				<div className='avatar'>
					<CircleAvatar avatarURL={Props.avatar} dimensions={85} showStatus={false}/>
					<span className='ranking'>
						{Props.ranking}
					</span>
				</div>
				<h6>{Props.fullName} </h6>
				<span>@{Props.username} </span>
			</div>
			<div className="actionButtons">
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
