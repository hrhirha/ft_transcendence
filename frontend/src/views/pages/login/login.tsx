import React from "react";
import { Brand } from "../../components/brand/brand";
import { LoginBg, Logo1337, Logo42} from '../../../assets'

export const Login:React.FC = () => {
    return (
    <main id="loginPage">
        <div>
            <Brand/>
            <h4>Welcome !
                <p>We're so excited to see you !</p>
            </h4>
            <button>
                <img src={Logo42} alt="42" />
                <span>Login</span>
            </button>
            <img src={Logo1337} alt="1337"/>
        </div>
    </main>
    );
}