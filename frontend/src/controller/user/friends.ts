import api from "api/axois";

export interface user_info {
    id: string,
    username: string,
    fullName: string,
    imageUrl :string,
}

export async function get_friends() {
    try
    {
        const res : user_info[] = (await api.get("user/friends")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function post_friend_block(user_id : string) {
    try
    {
        const res  = await api.post("user/friend/block", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_friends_blocked() {
    try
    {
        const res : user_info[] = (await api.get("user/friends/blocked")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function post_friend_unfriend(user_id : string) {
    try {
        const res  = await api.post("user/friend/unfriend", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}


export async function post_friend_unblock(user_id : string) {
    try
    {
        const res  = await api.post("user/friend/unblock", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}
