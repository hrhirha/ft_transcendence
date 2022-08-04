import api from "api/axois";

export interface user_infos {
    id: string,
    username:  string,
    fullName:  string,
    imageUrl:  string,
    score: number,
    wins: number,
    loses: number,
    status: string,
    rank: {
        title: string,
        icon: string,
        field: string
    }
    isTfaEnabled?: boolean,
    relation?: string
}

export async function get_me() {
    try
    {
        const res  : user_infos = (await api.get("user/me")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_user_by_id(user_id : string) {
    try
    {
        const res  : user_infos = (await api.get("user/id/"+ user_id )).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_user_by_username(username : string) {
    try
    {
        const res  : user_infos = (await api.get("user/u/"+ username )).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}