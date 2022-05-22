import React, { useState } from "react";
import { Brand } from "../../components/brand/brand";
import { LoginBg, Logo1337, Logo42} from '../../../assets';
import { useNavigate } from "react-router-dom";
import { get_friendreq_send } from "../../../controller/user/friendreqs.sent";
import { post_friend_accept } from "../../../controller/user/friendreq.accept";


export const Login:React.FC = () =>  {
    const [con, setCon] = useState();
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