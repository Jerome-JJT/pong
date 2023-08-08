import React from "react";

import UserBubble from "./UserBubble";
import NavigationBubble from "./NavigationBubble";

import "../../css/header.css"
// @ts-ignore

const Header = function({user}) {
    return (
        <div className="header">
            <div className="header-title">Transendance</div>
            <NavigationBubble></NavigationBubble>
            <UserBubble user={user}></UserBubble>
        </div>
    )
}



export default Header;