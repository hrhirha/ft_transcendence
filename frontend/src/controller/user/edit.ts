import api from "../../api/axois";

export async function post_friend_accept(user_username : string, user_imageUrl:string) {
    // "edit"
    try {
        const res  = await api.post("contact", {username : user_username, imageUrl : user_imageUrl});
        console.log(res);
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}