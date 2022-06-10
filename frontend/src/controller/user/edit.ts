import api from "../../api/axois";

export async function patch_edit_username(user_username : string) {
    try {
        const res  = await api.patch("user/edit/username", {username : user_username});
        return res.data;
    }catch (err) {
        return new Error("error : " + err);
    }
}

export async function patch_edit_fullname(user_fullName : string) {
    try {
        const res  = await api.patch("user/edit/fullname", {fullName : user_fullName});
        return res.data;
    }catch (err) {
        return new Error("error : " + err);
    }
}