import { createContext, useEffect, useState } from "react";

import { authSocketId, getStatus, socket } from "../api";
import Application from "./Application";
import "../css/main.css";

export interface User {
  avatar: string;
  username: string;
  id: number;
  xp: number;
  pointAverage: number;
  ratio: number;
  playedMatch: boolean;
  leaderboard: boolean;
  blockList?: number[];
  friendList?: number[];
  status: number;
}

export const AuthContext = createContext<User | undefined>(undefined);

function Auth() {
  const [wsConnected, setConnected] = useState(false);

  const [user, setUser] = useState<User>(null);
  const localhostback = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL + ":3000/auth/login"
    : "http://localhost:3000/auth/login";
  useEffect(() => {
    if (!user)
      getStatus()
        .then(function (response) {
          setUser(response.data);
        })
        .catch(function () {
          window.location.replace(localhostback);
        });
  }, [user]);

  useEffect(() => {
    function onDisconnect() {
      alert("deco mon reuf");
    }
    function onConnect() {
      setConnected(true);
    }

    socket.on("disconnect", onDisconnect);
    socket.on("connect", onConnect);

    return () => {
      socket.off("disconnect", onDisconnect);
      socket.off("connect", onConnect);
    };
  }, [wsConnected]);

  if (user && wsConnected)
    authSocketId(socket.id).then((response) => {
      socket.emit("register", { target: response.data });
    });

  return (
    <AuthContext.Provider value={user}>
      <Application></Application>
    </AuthContext.Provider>
  );
}

export default Auth;
