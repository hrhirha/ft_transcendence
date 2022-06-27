import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Props {
    type: string,
    icon: ReactNode,
    title: string,
    description: string,
    actions?: Array<{title: string, color: string, action: Function}>
}

const NotifContext = createContext({});

export const useNotif = () => useContext(NotifContext);


const NotifCard:React.FC<Props> = (Props) => {
    return (
    <section className={`notif ${Props.type}`} >
        <FontAwesomeIcon icon={faClose}/>
        <span className="icon">{Props.icon}</span>
        <div className="infos">
            <h6 className="title">{Props.title}</h6>
            <p className="description">{Props.description}</p>
            {Props.actions && <ul className="actions">
                {Props.actions.map((a, k) => {
                    return (k < 2)
                        ? <li className="action"
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
    const [notifs, setNotifs] = useState<Array<Props>>();

    return (
        <NotifContext.Provider value={setNotifs}>
            {children}
            {notifs && notifs.length > 0 && <div className="notifications">
                {notifs.map((n) => <NotifCard type={n.type} icon={n.icon} title={n.title} description={n.description} actions={n.actions}/>)}
            </div>}
        </NotifContext.Provider>
    );
}