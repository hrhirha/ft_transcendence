import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Props {
    type: string,
    icon: ReactNode,
    title: string,
    description: string,
    time: number,
    actions?: Array<{title: string, color: string, action: Function}>
}


const NotifContext = createContext(Function());

export const useNotif = () => useContext(NotifContext);


const NotifCard:React.FC<{animate: boolean, props: Props, onClose: Function}> = ({animate, props, onClose}) => {
    return (
    <section className={`notif ${props.type} ${animate ? "notifAnimation" : "notifix"}`} >
        <FontAwesomeIcon icon={faClose} onClick={() => onClose()}/>
        <span className="icon">{props.icon}</span>
        <div className="infos">
            <h6 className="title">{props.title}</h6>
            <p className="description">{props.description}</p>
            {props.actions && <ul className="actions">
                {props.actions.map((a, k) => {
                    return (k < 2)
                        ? <li className="action"
                            key={`${Date.now()}_${k}`}
                            style={{background: a.color}}
                            onClick={() => a.action()}>
                            {a.title}
                        </li>
                        : null;
                })}
            </ul>}
        </div>
    </section>
    );
}

export const Notif:React.FC<{children: Array<ReactNode>}> = ({children}) => {
    const [notifs, setNotifs] = useState<Array<Props>>([]);

    const pushNotif = (newNotif: Props) => {
        if (notifs.length > 4)
            setNotifs(oldNotifs => oldNotifs.splice(0, 4));
        else
            setNotifs(oldNotifs => [newNotif, ...oldNotifs]);
    }

    return (
        <NotifContext.Provider value={pushNotif}>
            {children}
            {notifs.length > 0 && <div className="notifications">
                {notifs.map((n, k) => <NotifCard key={`${k}_${Date.now()}`} animate={k == 0} onClose={() => setNotifs(notifs.filter((notif) => notif !== n))} props={n}/>)}
            </div>}
        </NotifContext.Provider>
    );
}