import React from 'react';
import ReactDOM from 'react-dom/client';
import "./views/style/index.scss";
import { Login } from './views/pages/login/login';
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './views/pages/home/home';
import { Chat } from './views/pages/chat/chat';
import { LeaderBoard } from './views/pages/leader_board/leader_board';
import { Friends } from './views/pages/friends/friends';
import { Profile } from './views/pages/profile/profile';


library.add(faPuzzlePiece);



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/leader_board" element={<LeaderBoard/>} />
          { <Route path="/chat" element={<Chat/>} /> }
          <Route path="/friends" element={<Friends/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="*" element={<Home/>} />

      </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
