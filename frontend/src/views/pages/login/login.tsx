import React, { useState } from "react";
import { Brand } from "../../components/brand/brand";
import { Logo1337, Logo42} from '../../../assets';
import { AuthChecker } from "../../components/check_auth/auth_checker";


export const Login:React.FC = () =>  {
    const [con, setCon] = useState();

    const ConnectTo42 = async () => {
        window.open("http://127.0.0.1:3001/auth/login", '_self');
    }
    
    return (
        <AuthChecker
        redirect="/"
        wrappedContent={
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
                <p>{con}</p>
            </div>
        </main>}
    />
    );
}