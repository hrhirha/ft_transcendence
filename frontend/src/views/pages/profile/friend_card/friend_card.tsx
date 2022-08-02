import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar'
import { buttons, userType } from 'views/pages/profile/profile'

interface Props {
	type: userType,
	id: string,
	avatar: string,
	fullName: string,
	username: string,
	action: Function
}

export const FriendCard = (Props : Props) => {
	const navigate = useNavigate();

	return (
		<div className="friendCard">
			<div className="friendInfos" onClick={() => navigate(`/u/${Props.username}`)}>
				<div className='avatar'>
					<CircleAvatar avatarURL={Props.avatar} dimensions={85} showStatus={false}/>
				</div>
				<h6>{Props.fullName} </h6>
				<span>@{Props.username} </span>
			</div>
			<div className="actionButtons">
				{buttons.map((button) => {
					if (button.type === Props.type) {
						return (
							<button
								key={`${button.text.replace(' ', '')}`}
								className={`btn${button.text.replace(' ', '')}`}
								onClick={() => {
									button.onClick(Props.id, Props.action);
								}}>
								<FontAwesomeIcon icon={button.icon} />
								{button.text}
							</button>
						);
					}
					return null;
				})}
			</div>
		</div>)
}
