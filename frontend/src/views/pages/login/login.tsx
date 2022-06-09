import React, { useState } from "react";
import { Brand } from "../../components/brand/brand";
import { Logo1337, Logo42} from '../../../assets';
import { useNavigate } from "react-router-dom";
import { get_friendreq_send } from "../../../controller/user/friendreqs.sent";
import { post_friend_accept } from "../../../controller/user/friendreq.accept";
import { get_me } from "../../../controller/user/user";
import { promises } from "stream";


export const Login:React.FC = () =>  {
    const [con, setCon] = useState();
    const navigate = useNavigate();

    const ConnectTo42 = async () => {
        window.open("http://127.0.0.1:3001/auth/login", '_self');
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
            <p>{con}</p>
        </div>
    </main>
    );
}