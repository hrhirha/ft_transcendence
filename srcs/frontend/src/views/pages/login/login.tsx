import React from "react";
import { Brand } from "views/components/brand/brand";
import { Logo1337, Logo42 } from 'assets';
import { env } from "index";


export const Login:React.FC = () =>  {

    const ConnectTo42 = async () => {
        window.open(`http://${env.apiHost}:${env.apiPort}/auth/login`, '_self');
    }
    
    return (
        <main id="loginPage">
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
            </div>
        </main>
    );
}