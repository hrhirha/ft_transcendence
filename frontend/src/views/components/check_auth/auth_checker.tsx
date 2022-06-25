import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get_me } from "../../../controller/user/user";

export const AuthChecker:React.FC<{wrappedContent: React.ReactNode, redirect: string}> = ({wrappedContent, redirect}) => {
    const navigator = useNavigate();
    const location = useLocation();
    const [go, setGo] = useState(false);
    useEffect(() =>  {
        (async function anyNameFunction() {
            try {
                const me = await get_me();
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
        {go && wrappedContent}
    </>);
}