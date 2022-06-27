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
import { Profile } from './views/pages/profile/profile';
import { NotFound } from './views/pages/not_found/not_found';
import { AuthChecker } from './views/components/check_auth/auth_checker';


library.add(faPuzzlePiece);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <BrowserRouter>
      <Routes>
          <Route path="/login" element={<AuthChecker redirect="/login" wrappedContent={<Login/>}/>}/>
          <Route path="/" element={<AuthChecker redirect="/" wrappedContent={<Home/>} />} />
          <Route path="/leader_board" element={<AuthChecker redirect="/leader_board" wrappedContent={<LeaderBoard/>} />} />
          <Route path="/chat" element={<AuthChecker redirect="/chat" wrappedContent={<Chat/>}/>} />
          <Route path="/profile" element={<AuthChecker redirect="/profile" wrappedContent={<Profile/>}/>} />
          <Route path="*" element={<AuthChecker redirect="/" wrappedContent={<NotFound/>}/>} />
      </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
