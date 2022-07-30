import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get_me, user_infos } from "../../../controller/user/user";
import { Loading } from "../loading/loading";
import { NavBar } from "../navbar/navbar";
import { Notif } from "../notif/notif";

export const AuthChecker:React.FC<{wrappedContent: React.ReactNode, redirect: string}> = ({wrappedContent, redirect}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const navigator = useNavigate();
    const location = useLocation();

    useEffect(() =>  {
        (async () => {
            try {
                const me: user_infos = await get_me();
                setUser(me);
                if (location.pathname != redirect)
                    navigator(redirect);
            }
            catch(err: AxiosError | any) {
                if (location.pathname != "/login" && location.pathname != "/checkpoint")
                    navigator("/login");
            }
            setLoading(false);
        })();
    }, []);
    return (<Notif>
        {loading && <Loading width="100vw" height="100vh"/>}
        {!loading && (location.pathname != "/login" && location.pathname != "/checkpoint") && <NavBar user={user}/>}
        {!loading && wrappedContent}
    </Notif>);
}