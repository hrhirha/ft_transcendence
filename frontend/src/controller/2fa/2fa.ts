import api from "../../api/axois";

export async function enable(_code : string) {
    const res  = await api.post("2fa/enable", {code : _code});
    return res.data;
}

export async function disable() {
    const res  = await api.post("2fa/disable");
    return res.data;
}

export async function authenticate(_code : string) {
    const res  = await api.post("2fa/authenticate", {code : _code});
    return res.data;
}