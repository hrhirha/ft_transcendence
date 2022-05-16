import React from 'react';
import ReactDOM from 'react-dom/client';
import "./views/style/index.scss";
import { Login } from './views/pages/login/login';
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './views/pages/home/home';

library.add(faPuzzlePiece);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>} />
          {/* <Route path="/" element={<Home/>} /> */}
          {/* <Route path="/leader_board" element={<LeaderBoard/>} /> */}
          {/* <Route path="/chat" element={<Chat/>} /> */}
          {/* <Route path="/notifications" element={<Notifications/>} /> */}
          {/* <Route path="/friends" element={<Friends/>} /> */}
          {/* <Route path="/profile" element={<Profile/>} /> */}
          <Route path="*" element={<Login/>} />

      </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
