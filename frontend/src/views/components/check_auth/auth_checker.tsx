import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get_me, User } from "controller/user/user";
import { Loading } from "views/components/loading/loading";
import { NavBar } from "views/components/navbar/navbar";
import { Notif } from "views/components/notif/notif";

export const AuthChecker:React.FC<{wrappedContent: React.ReactNode, redirect: string}> = ({wrappedContent, redirect}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const params = useParams();
    const navigator = useNavigate();
    const location = useLocation();

    useEffect(() =>  {
        (async () => {
            try {
                const me: User = await get_me();
                setUser(me);
                if (location.pathname != redirect)
                {
                    if (redirect === "/u")
                        navigator(`/u/${params.username}`, {replace : true});
                    else
                        navigator(redirect, {replace : true});
                }
            }
            catch(err: AxiosError | any) {
                if (location.pathname != "/login" && location.pathname != "/checkpoint")
                    navigator("/login", {replace : true});
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