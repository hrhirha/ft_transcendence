import api from "../../api/axois";

export interface me_info {
    id: string,
    createdAt?: string,
    updatedAt?: string,
    username: string,
    email: string,
    fullName: string,
    profileUrl?: string,
    imageUrl: string,
    refresh_token?: string,
    isTfaEnabled?: boolean,
    tfaSecret?: string,
    score: number,
    rank: number,
    status: string,
    wins: number,
    loses: number
}

export interface user_infos {
    username:  string,
    email:  string,
    fullName:  string,
    imageUrl:  string,
    score: number,
    rank: number,
    wins: number,
    loses: number,
    status: string,
    relation?: string //relation between me and user (profile) [none | friend | request | blocked | pending]
}

export async function get_me() {
    const res  : me_info = (await api.get("user/me")).data;
    return res;
}

export async function get_user_by_id(user_id : string) {
    const res  : user_infos = (await api.get("user/id/"+ user_id )).data;
    return res;
}

export async function get_user_by_username(username : string) {
    const res  : user_infos = (await api.get("user/u/"+ username )).data;
    return res;
}