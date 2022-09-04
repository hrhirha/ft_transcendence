import { faBan, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocketContext } from 'index';
import React, { useContext, useState } from 'react'
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
    type: string,
    chatRef: React.LegacyRef<HTMLDivElement>,
}

export const Chat_msg = (Props : Props) => {
  const class_socket = useContext(SocketContext);
  const pushNotif = useNotif();
  const myMessage = Props.sender_user === JSON.parse(window.localStorage.getItem("user")).id;
  const notifMsg = Props.type === "NOTIFICATION";

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
    <div ref={Props.chatRef} className={notifMsg ? "msgNotif" : (Props.display_image ? "mtop " : " ")+( myMessage ? "sent" : "receive")}>
        {!notifMsg && Props.display_image && <CircleAvatar avatarURL={Props.image} dimensions={30} status = {null}/>}
        <span className={!Props.display_image ? "first_msg" : "msg"}>{Props.type === "MSG_DELETED" ? <span className='deleted'><FontAwesomeIcon icon={faBan}/> {Props.msg}</span> : Props.msg}</span>
        {!notifMsg && myMessage && Props.type !== "MSG_DELETED"
          && <i title='Delete' onClick={() => removeMessage()}>
              <FontAwesomeIcon icon={faTrashCan} />
            </i>}
    </div>
  )
}
