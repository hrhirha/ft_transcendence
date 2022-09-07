import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

interface Notification {
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
const NotifCard:React.FC<{notif: Notification, onClose: Function}> = ({notif, onClose}) => {

    useEffect(() => {
        const interval = setInterval(() => {
            onClose(notif.id);
            clearInterval(interval);
        }, notif.time);
    }, []);

    return (
    <section className={`notif ${notif.type}`} >
        <FontAwesomeIcon icon={faClose} onClick={() => onClose()}/>
        <span className="icon">{notif.icon}</span>
        <div className="infos">
            <h6 className="title">{notif.title}</h6>
            <p className="description" dangerouslySetInnerHTML={{ __html: notif.description.substr(0, 150)+(notif.description.length > 150 ? "..." : "")}}/>
            {notif.actions && <ul className="actions">
                {notif.actions.map((a, k) => {
                    return (k < 2)
                        ? <li className="action"
                            key={`${Date.now()}_${k}`}
                            style={{background: a.color}}
                            onClick={() => {
                                onClose();
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

export const Notif:React.FC<{children: ReactNode}> = ({children}) => {
    const [notifs, dispatch] = useReducer((state: any, action: any) => {
        switch (action.type) {
            case "ADD_NOTIF":
                if (state.find((notif: Notification) => notif.id === action.payload.id))
                    return state;
                if (action.payload.time === undefined)
                    action.payload.time = 5000;
                if (state.length > 4)
                    return [...state.shift(), action.payload];
                return [...state, action.payload];
            case "REMOVE_NOTIF":
                return state.filter((notif: Notification) => notif.id !== action.payload);
            default:
                return state;
        }
    }, []);

    const pushNotif = (newNotif: Notification) => {
        dispatch({type: "ADD_NOTIF", payload: newNotif});
    }

    return (
        <NotifContext.Provider value={pushNotif}>
            {children}
            {notifs.length > 0 && <div className="notifications">
                {notifs.map((n, k) => <NotifCard key={`${k}_${Date.now()}`} notif={n} onClose={() => dispatch({type: "REMOVE_NOTIF", payload: n.id})}/>)}
            </div>}
        </NotifContext.Provider>
    );
}