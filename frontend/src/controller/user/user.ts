import api from "../../api/axois";

interface me_info {
    id: string,
    createdAt: string,
    updatedAt: string,
    username: string,
    email: string,
    fullName: string,
    profileUrl: string,
    imageUrl: string,
    refresh_token: string,
    isTfaEnabled: false,
    tfaSecret: string,
    score: number,
    rank: number,
    status: string,
    wins: number,
    loses: number
}

interface user_info {
    username:  string,
    email:  string,
    fullName:  string,
    imageUrl:  string,
    score: number,
    rank: number,
    wins: number,
    loses: number,
    status: string,
}

export async function get_me() {
    try
    {
        const res  : me_info = (await api.get("user/me")).data;
        return res;
    }catch (err)
    {
        return new Error("error : " + err);
    }
}

export async function get_user_by_id(user_id : string) {
    try
    {
        const res  : user_info = (await api.get("user/id/"+ user_id )).data;
        return res;
    }catch (err)
    {
        return new Error("error : " + err);
    }
}

export async function get_user_by_username(username : string) {
    try
    {
        const res  : user_info = (await api.get("user/u/"+ username )).data;
        return res;
    }catch (err)
    {
        return new Error("error : " + err);
    }
}