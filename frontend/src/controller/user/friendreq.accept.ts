import api from "../../api/axois";

export async function post_friend_accept(user_id : string) {
    // "friendreq/accept"
    try {
        const res  = await api.post("contact", {id : user_id});
        console.log(res);
    }catch (err) {
        console.log(err);
    }
    
    return "res";
}