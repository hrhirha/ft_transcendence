import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get_me, user_infos } from "../../../controller/user/user";
import { NavBar } from "../navbar/navbar";

export const AuthChecker:React.FC<{wrappedContent: React.ReactNode, redirect: string}> = ({wrappedContent, redirect}) => {
    const navigator = useNavigate();
    const location = useLocation();
    const [go, setGo] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    useEffect(() =>  {
        (async function anyNameFunction() {
            try {
                const me: user_infos = await get_me();
                setUser(me);
                if (location.pathname != redirect)
                    navigator(redirect);
            }
            catch(err: AxiosError | any) {
                if (location.pathname != "/login")
                    navigator("/login");
            }
            setGo(true);
        })();
    }, []);

    return (<>
        {go && (location.pathname != "/login") && <NavBar user={user}/>}
        {go && wrappedContent}
    </>);
}