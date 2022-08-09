import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface Props {
    id: string,
    type: string,
    icon: ReactNode,
    title: string,
    description: string,
    time: number,
    actions?: Array<{title: string, color: string, action: Function}>
}


const NotifContext = createContext(Function());

export const useNotif = () => useContext(NotifContext);
const animatedNotifs: Array<Props> = [];

const NotifCard:React.FC<{props: Props, onClose: Function, setNotifs: Function}> = ({props, onClose, setNotifs}) => {
    
    return (
    <section className={`notif ${props.type} ${animatedNotifs.find((n) => n === props) ? "notifAnimation" : "notifix"}`} >
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
                            onClick={() => {
                                setNotifs(notifs => notifs.filter((notif) => notif.id !== props.id));
                                a.action();
                            }}>
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
    const [timer, setTimer] = useState<any>();
    const pushNotif = (newNotif: Props) => {
        if (notifs.find(n => n.id === newNotif.id))
            return ;
        if (newNotif.time === undefined)
            newNotif.time = 5000;
        if (notifs.length > 4)
            setNotifs(oldNotifs => oldNotifs.splice(0, 4));
        else
            setNotifs(oldNotifs => [newNotif, ...oldNotifs]);
    }
    useEffect(() => {
        if (notifs.length > 0)
        {
            setTimer(setInterval(() => {
                setNotifs(notifs.filter(n => {
                    n.time -= 1000;
                    return n.time >= 0;
                }));
            }, 500));
        }
        if (notifs.length >= 0)
            clearInterval(timer);
    }, [notifs]);

    return (
        <NotifContext.Provider value={pushNotif}>
            {children}
            {notifs.length > 0 && <div className="notifications">
                {notifs.map((n, k) => <NotifCard key={`${k}_${Date.now()}`} setNotifs={setNotifs} onClose={() => setNotifs(notifs.filter((notif) => notif !== n))} props={n}/>)}
            </div>}
        </NotifContext.Provider>
    );
}