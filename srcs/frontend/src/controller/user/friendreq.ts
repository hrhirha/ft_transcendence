import api from "index";
import { User } from "controller/user/user";

export async function post_friendreq_accept(user_id : string) {
    try {
        const res  = await api.post("user/friendreq/accept", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function post_friendreq_send(user_id : string) {
    try {
        const res  = await api.post("user/friendreq/send", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_friendreqs_received() {
    try {
        const res : User[] = (await api.get("user/friendreqs/received")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_friendreqs_sent() {
    try {
        const res : User[] = (await api.get("user/friendreqs/sent")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function post_friendreq_decline(user_id : string) {
    try {
        const res  = await api.post("user/friendreq/decline", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function post_friendreq_cancel(user_id : string) {
    try {
        const res  = await api.post("user/friendreq/cancel", {id : user_id});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}