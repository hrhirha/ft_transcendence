import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocketContext } from 'index';
import React, { useContext } from 'react'
import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar'
import { useNotif } from 'views/components/notif/notif';

interface Props {
    msgId: string,
    roomId: string,
    display_image :boolean,
    sender_user: string,
    image: string,
    msg: string,
    time: string,
}

export const Chat_msg = (Props : Props) => {
  const class_socket = useContext(SocketContext);
  const pushNotif = useNotif();

  const removeMessage = () => {
    pushNotif({
      id: "REMOVE_MESSAGE",
      type: "info",
      icon: <FontAwesomeIcon icon={faTrashCan}/> ,
      title: "Confirmation",
      description: "Are you sure want to delete this message?",
      actions: [
        {title: "Delete", color: "#6970d4", action: () => {
            class_socket.delete_message({id : Props.msgId,  rid : Props.roomId});
        }},
        {title: "Cancle", color: "#6970d4", action: () => {}},
      ]
    });
  }

  return (
    <div className={(!Props.display_image ? "mtop " : "") + (Props.sender_user === JSON.parse(window.localStorage.getItem("user")).id ? "Me" : "User")}>
        {!Props.display_image && <CircleAvatar avatarURL={Props.image} dimensions={30} status = {null}/>}
        <span className={Props.display_image? "first_msg" : "msg"}>{Props.msg}</span>
        {Props.sender_user === JSON.parse(window.localStorage.getItem("user")).id
          && <i onClick={() => removeMessage()}>
              <FontAwesomeIcon icon={faTrashCan} />
            </i>}
    </div>
  )
}
