import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TFAauthenticate } from "controller/auth/auth";
import { Brand } from "views/components/brand/brand";

export const Checkpoint:React.FC = () =>  {
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();


    const TFAAuth = async () => {
        try {
            await TFAauthenticate(code);
            navigate("/", {replace: true});
        } catch(e: any) {
            setError(e.message);
        } 
    }

    return (
        <main id="checkpoint">
            <div className="twofaCard">
                <Brand />
                <h3>2FA required</h3>
                <p>Please enter 6 digits CODE from your authenticator app</p>
                <input type="text" className="twofaCode" placeholder="CODE HERE" onChange={(e) => {
                    const val = e.target.value.trim();
                    if (Number.isInteger(Number(val)) && val.length < 7)
                        setCode(val);
                }} value={code}/>
                {error != "" && <span className="error">{error}</span>}
                <button  onClick={() => TFAAuth()} className="confirm">Continue</button>
            </div>
        </main>
    );
}