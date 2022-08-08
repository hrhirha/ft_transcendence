import React, { useState } from "react";
import { Brand } from "views/components/brand/brand";
import { Logo1337, Logo42, Background} from 'assets';


export const Login:React.FC = () =>  {
    const [con, setCon] = useState();

    const ConnectTo42 = async () => {
        window.open("http://127.0.0.1:3001/auth/login", '_self');
    }
    
    return (
        <main id="loginPage" style={{backgroundImage: Background}}>
            <div>
                <Brand/>
                <h4>Welcome !
                    <p>We're so excited to see you !</p>
                </h4>
                <button onClick={ConnectTo42}> 
                    <img src={Logo42} alt="42" />
                    <span>Login</span>
                </button >
                <img src={Logo1337} alt="1337"/>
                <p>{con}</p>
            </div>
        </main>
    );
}