import api from "../../api/axois";

interface user_info {
    id: string,
    createdAt: string,
    updatedAt: string,
    username: string,
    email:string,
    firstName: string,
    lastName: string,
    profileUrl: string,
    imageUrl: string,
    refresh_token: any,
    isTfaEnabled: boolean,
    tfaSecret: any,
    score: number,
    status: any,
    wins: number,
    loses: number,
}

export async function get_friends() {
    // "user/friends"
    const res : user_info[] = (await api.get("contact")).data;
    console.log(res);
    return res;
}

export async function post_friend_block(user_id : string) {
    // "friend/block"
    try {
        const res  = await api.post("contact", {id : user_id});
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}

export async function post_friend_unfriend(user_id : string) {
    // "friend/unfriend"
    try {
        const res  = await api.post("contact", {id : user_id});
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}


export async function post_friend_unblock(user_id : string) {
    // "friend/unblock"
    try {
        const res  = await api.post("contact", {id : user_id});
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}

export async function post_friend_decline(user_id : string) {
    // "friendreq/decline"
    try {
        const res  = await api.post("contact", {id : user_id});
        return res;
    }catch (err) {
        return new Error("error : " + err);
    }
}
