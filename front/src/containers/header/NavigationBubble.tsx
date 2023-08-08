import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ChatButton from "../../components/svg/ChatButton";
import PlayButton from "../../components/svg/PlayButton";
import LeaderboardButton from "../../components/svg/LeaderboardButton";
import HeaderNavigationIcon from "./HeaderNavigationIcon";

import "../../css/header.css"

const NavigationBubble = () => {
    const navigate = useNavigate();
    let location = useLocation();

    const [state, setState] = useState(location.pathname);

    const handleClick = (text) => {
        setState(text);
        navigate(text);
    };

    useEffect(() => {
        setState(location.pathname);
      }, [location.pathname]);
    
    return (
    <div className="navigation bubble">
        <HeaderNavigationIcon handleClick={handleClick} text="/social"
        state={state} children={<ChatButton />} description="social"></HeaderNavigationIcon>

        <HeaderNavigationIcon handleClick={handleClick} text="/"
        state={state} children={<PlayButton />} description="home"></HeaderNavigationIcon>

        <HeaderNavigationIcon handleClick={handleClick} text="/leaderboard"
        state={state} children={<LeaderboardButton />} description="leaderboard"></HeaderNavigationIcon>
    </div>
    );
};

export default NavigationBubble;