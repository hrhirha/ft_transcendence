import React from "react";
import { Brand } from "../../components/brand/brand";
import { LoginBg, Logo1337, Logo42} from '../../../assets';
import { useNavigate } from "react-router-dom";

export const Login:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="loginPage">
        <div>
            <Brand/>
            <h4>Welcome !
                <p>We're so excited to see you !</p>
            </h4>
            <button onClick={() => navigate("/")}>
                <img src={Logo42} alt="42" />
                <span>Login</span>
            </button>
            <img src={Logo1337} alt="1337"/>
        </div>
    </main>
    );
}