import api from "index";

export interface User {
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

export const userDefault = {
    id: "",
    username: "",
    fullName: "",
    imageUrl: "",
    score: 0,
    wins: 0,
    loses: 0,
    status: "",
    rank: {
        title: "",
        icon: "",
        field: "",
        require: 0
    },
    isTfaEnabled: false
};

export async function get_me() {
    try
    {
        const res  : User = (await api.get("user/me")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_all_users() {
    try
    {
        const res  : Array<User> = (await api.get("user/all")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_user_by_id(user_id : string) {
    try
    {
        const res  : User = (await api.get("user/id/"+ user_id )).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_user_by_username(username : string) {
    try
    {
        const res  : User = (await api.get("user/u/"+ username )).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}