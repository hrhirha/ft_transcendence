import { faClose, faLock, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
    return (
        <section className="panel">
            <div className="twofaCard">
                <FontAwesomeIcon icon={faClose}  onClick={() => onClose()}/>
                <h3>{enabled ? "Disable 2FA" : "Enable 2FA"}</h3>
                {!enabled && <img src={`http://127.0.0.1:3001/2fa/generate`} alt="qrcode"/>}
                <input type="text" className="twofaCode" placeholder="CODE HERE" onChange={(e) => {
                    const val = e.target.value.trim();
                    console.log(Number.isInteger(Number(val)), val.length < 7);
                    if (Number.isInteger(Number(val)) && val.length < 7)
                        setCode(val);
                }} value={code}/>
                <button  onClick={() => onSubmit(code)} className="confirm">Confirme</button>
            </div>
        </section>
    );
}