import { faClose, faLock, faQrcode, faQuestion, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { env } from "index";
import React, { useState } from "react";
import { useNotif } from "../notif/notif";

export const TwoFAButton:React.FC<{enabled: boolean, onClick: Function}> = ({enabled, onClick}) => {
    return (
        <button className="twoFASwitch" onClick={() => onClick()}>
            <FontAwesomeIcon  icon={enabled ? faLock : faQrcode} />
            {enabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
    );
}

export const TwoFACard:React.FC<{enabled: boolean, onClose: Function, onSubmit: Function}> = ({enabled, onClose, onSubmit}) => {
    const [code, setCode] = useState<string>("");
    const pushNotif = useNotif();
    return (
        <section className="panel">
            <div className="twofaCard">
                <FontAwesomeIcon icon={faClose}  onClick={() => onClose()}/>
                <h3>{enabled ? "Disable 2FA" : "Enable 2FA"}</h3>
                {!enabled && <img src={`http://${env.apiHost}:${env.apiPort}/2fa/generate`} alt="qrcode"/>}
                <input type="text" className="twofaCode" placeholder="CODE HERE" onChange={(e) => {
                    const val = e.target.value.trim();
                    console.log(Number.isInteger(Number(val)), val.length < 7);
                    if (Number.isInteger(Number(val)) && val.length < 7)
                    setCode(val);
                }} value={code}/>
                <button  onClick={() => onSubmit(code)} className="confirm">Confirme</button>
                {!enabled && <span className="help" onClick={() => pushNotif({
                    id: "HOWTOUSE2FA",
                    type: "info",
                    icon: <FontAwesomeIcon icon={faQuestion}/>,
                    time: 15000,
                    title: "How to use 2FA ?",
                    description:"Install an authenticator app on your phone and scan QR code above !"
                })}><FontAwesomeIcon icon={faQuestionCircle} />How to use</span>}
            </div>
        </section>
    );
}