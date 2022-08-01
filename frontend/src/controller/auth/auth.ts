import api from "../../api/axois";

export async function enableTFA(_code : string) {
    try {
        const res  = await api.post("2fa/enable", {code : _code});
        return res.data;
    } catch(e: any) {
        throw({message: "Please make sure to scan QR code and set CODE from Authenticator app"});
    }
}

export async function disableTFA(_code : string) {
    try {
        const res  = await api.post("2fa/disable", {code : _code});
        return res.data;
    } catch(e: any) {
        throw({message: "An error occurred while disabling 2FA methode please use CODE from Athenticator app"});
    }
}

export async function TFAauthenticate(_code : string) {
    try {
        const res  = await api.post("2fa/authenticate", {code : _code});
        return res.data;
    } catch(e: any) {
        throw ({message: "Incorrect CODE"});
    }
}

export async function logout() {
    try {
        const res  = await api.get("/auth/logout");
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}