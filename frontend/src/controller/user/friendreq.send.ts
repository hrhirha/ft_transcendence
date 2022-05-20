import api from "../../api/axois";

export async function post_friend_send(user_id : string) {
    // "friendreq/send"
    try {
        const res  = await api.post("contact", {id : user_id});
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}