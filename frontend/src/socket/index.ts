import io from "socket.io-client";


    //test socket connection

/*
    useEffect(() => {
        class_socket.socket.on("chats", (data : any)=>{
            console.log(data)
        })
        
    },[class_socket.socket])
 
 */
 
     //--------------------
     
interface info_create_room {
    name:  string,
    is_private? : boolean,
    password?: string,
    uids: string[],
}

interface info_delete_room {
    id:  string,
    password? : string,
}

export class Socket {
    socket :any;
    constructor() {
        this.socket = io("ws://127.0.0.1:3001/chat",{
            withCredentials: true
        });
    }

    get_chats() {
        this.socket.emit("get_chats");
    }

    create_room(info_room : info_create_room) {
        if(info_room.name.length == 0)
            return new Error("error : name must not be empty");
        if(info_room.uids.length == 0)
            return new Error("error : number of users must be greater than 0");
        this.socket.emit("create_room", info_room);
    }

    delete_room(info_room : info_delete_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("delete_room", info_room);
    }

    start_dm(id: string) {
        this.socket.emit("start_dm", id);
    }

    join_room() {
        this.socket.emit("join_room");
    }

    leave_room() {
        this.socket.emit("leave_room");
    }

    add_member() {
        this.socket.emit("add_member");
    }

    remove_member() {
        this.socket.emit("remove_member");
    }

    ban_user() {
        this.socket.emit("ban_user");
    }

    unban_user() {
        this.socket.emit("unban_user");
    }

    mute_user() {
        this.socket.emit("mute_user");
    }

    unmute_user() {
        this.socket.emit("unmute_user");
    }

    send_message() {
        this.socket.emit("send_message");
    }

    delete_message() {
        this.socket.emit("delete_message");
    }

    join() {
        this.socket.emit("join");
    }

    leave() {
        this.socket.emit("leave");
    }

    get_members() {
        this.socket.emit("get_members");
    }

    get_messages() {
        this.socket.emit("get_messages");
    }

  }