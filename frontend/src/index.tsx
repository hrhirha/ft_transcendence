import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from 'views/pages/login/login';
import { Routes, Route, unstable_HistoryRouter as Router } from 'react-router-dom'
import { Home } from 'views/pages/home/home';
import { Chat } from 'views/pages/chat/chat';
import { LeaderBoard } from 'views/pages/leader_board/leader_board';
import { Profile } from 'views/pages/profile/profile';
import { NotFound } from 'views/pages/not_found/not_found';
import { Checkpoint } from 'views/pages/checkpoint/checkpoint';
import { GamePlayer } from 'views/pages/game/game_player/game_player';
import { GameWatcher } from 'views/pages/game/game_watcher/game_watcher';
import { createBrowserHistory } from "history";
import { get_me, User } from 'controller/user/user';
import { Notif, useNotif } from 'views/components/notif/notif';
import { Loading } from 'views/components/loading/loading';
import { NavBar } from 'views/components/navbar/navbar';
import { ChatSocket } from "controller/chat_socket";
import { challenge_data, receive_message } from 'controller/chat_socket/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar';
import axios from "axios";
import _ from 'lodash';
import "views/style/index.scss";
import { io } from 'socket.io-client';
import { SetupAccount } from 'views/pages/setup_account/setup_account';

export const env = _.mapKeys(_.pickBy(process.env, (value, key) => {
  return _.startsWith(key, 'REACT_APP_');
}), (value, key) => {
    return _.camelCase(_.replace(key, 'REACT_APP_', ''));
});

export default axios.create({
  baseURL : `http://${env.apiHost}:${env.apiPort}`,
  withCredentials: true 
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const getIDQuery = () => {
  const searchParams = new URLSearchParams(history.location.search);
  return searchParams.get('id');
}
export const SocketContext = createContext(null); //create socket context
export const history = createBrowserHistory();
export const game_socket = io(`ws://${env.apiHost}:${env.apiPort}/game`, {withCredentials: true, closeOnBeforeunload: false});
const class_socket = new ChatSocket();

const PongApp:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [hideNavBar, setHideNavBar] = useState<boolean>(true);
    const pushNotif = useNotif();
    const authCheck = async (path) => {
      try {
          const me: User = await get_me();
          window.localStorage.setItem("user", JSON.stringify(me));
          if (history.location.pathname === "/login"
            || history.location.pathname === "/checkpoint"
            || history.location.pathname === "/setup")
            history.replace("/");
        setHideNavBar(false);
      }
      catch(err: any) {
        setHideNavBar(true);
        if (err.statusCode === 401 && path !== "/login" && path !== "/checkpoint")
            history.replace("/login");
        else if (err.statusCode === 403 && path !== "/setup")
            history.replace("/setup");
      }
      setLoading(false);
    }
    
    useEffect(() => {
      authCheck(history.location.pathname);
      history.listen(async ({ action, location }) => {
        if (location.pathname !== "/watcher" && location.pathname !== "/play" && location.pathname !== "/play/ultimate")
          game_socket.disconnect();
        await authCheck(location.pathname);
      });
      class_socket.socket.on("receive_message", (message : receive_message)=>{
        if (history.location.pathname !== "/chat" && message.type !== "NOTIFICATION")
        {
          pushNotif({
            id: message.room.id,
            type: "info",
            icon: message.room.is_channel ? <FontAwesomeIcon icon={faUserGroup}/> : <CircleAvatar avatarURL={message.user.imageUrl} dimensions={15} status={"ONLINE"} />,
            title: (message.room.is_channel ? message.room.name : message.user.fullName),
            description: message.room.is_channel ? `<b>${message.user.username} : </b>${message.msg}</>` : message.msg,
            actions: [
              {title: "Go Chat", color: "#6970d4", action: () => history.replace(`/chat?id=${message.room.id}`)},
            ]
          });
        }
      }).on("challenge_requested", (data: challenge_data) => {
        if (data.invite)
        {
          pushNotif({
            id: "CHALLENGE"+data.user.id,
            type: "info",
            time: 20000,
            icon: <FontAwesomeIcon icon={faGamepad}/>,
            title: "Challenge",
            description: `<b>${data.user.fullName.split(" ")[0]}</b> invite you to play a${data.type === "ultimateQue" ? "n <b>Ultimate</b>" : " <b>Normal</b>"} game`,
            actions: [
              {title: "Accept", color: "#6970d4", action: () => {
                window.localStorage.setItem("privateGame", JSON.stringify({"userId": data.user.id}));
                class_socket.challenge({
                  id: data.user.id,
                  type: data.type,
                  invite: false
                })
                if (data.type === "ultimateQue")
                  history.replace("/play/ultimate");
                else
                  history.replace("/play");
              }},
              {title: "Decline", color: "#6970d4", action: () => {
                //TODO: send decline
              }},
            ]
          });
        } else {
          pushNotif({
            id: "ACCEPTEDCHALLENGE"+data.user.id,
            type: "info",
            time: 20000,
            icon: <FontAwesomeIcon icon={faGamepad}/>,
            title: "Challenge",
            description: `<b>${data.user.fullName.split(" ")[0]}</b> accepted your challenge`,
            actions: [
              {title: "Join him", color: "#6970d4", action: () => {
                window.localStorage.setItem("privateGame", JSON.stringify({"userId": data.user.id}));
                if (data.type === "ultimateQue")
                  history.replace("/play/ultimate");
                else
                  history.replace("/play");
              }}
            ]
          });
        }
      });
    }, []);

    if (loading)
      return <Loading width="100vw" height="100vh"/>;
    return (
      <SocketContext.Provider value={class_socket}>
          <Router history={history}>
              {!hideNavBar && <NavBar/>}
              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/checkpoint" element={<Checkpoint/>} />
                  <Route path="/setup" element={<SetupAccount/>} />
                  <Route path="/" element={<Home/>} />
                  <Route path="/leader_board" element={<LeaderBoard/>} />
                  <Route path="/play" element={<GamePlayer ultimateGame={false}/>} />
                  <Route path="/play/ultimate" element={<GamePlayer ultimateGame={true}/>} />
                  <Route path="/watch" element={<GameWatcher />} />
                  <Route path="/chat" element={<Chat/>} />
                  <Route path="/profile" element={<Profile userProfile={true}/>} />
                  <Route path="/u/:username" element={<Profile userProfile={false}/>} />
                  <Route path="*" element={<NotFound/>} />
              </Routes>
          </Router>
      </SocketContext.Provider>
    );
}

root.render(
  <Notif>
    <PongApp />
  </Notif>
);
