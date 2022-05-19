import React, { useState } from "react";
import { Brand } from "../../components/brand/brand";
import { LoginBg, Logo1337, Logo42} from '../../../assets';
import { useNavigate } from "react-router-dom";
import { get_user_me } from "../../../controller/user/me";
import { get_friendreq_send } from "../../../controller/user/friendreqs.sent";


export const Login:React.FC = () =>  {
    const [con, setCon] = useState()

    //get_user_me();
    get_friendreq_send();
    const navigate = useNavigate();
    return (
    <main id="loginPage">
        <div>
            <Brand/>
            <h4>Welcome !
                <p>We're so excited to see you !</p>
            </h4>
            <button > 
                <img src={Logo42} alt="42" />
                <span>Login</span>
            </button >
            <img src={Logo1337} alt="1337"/>
            <p>{con}</p>
        </div>
    </main>
    );
}