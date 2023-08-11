import "../../css/chat.css";
import Conversations from "./conversation/Conversations";
import {useState} from "react";
import Friends from "./friend/Friends";
import React from "react";

export default function SocialBody(){

    const [state]=useState(null);



    return (
        <div className="chatbody bubble">
            <Conversations state={state} ></Conversations>
            <div className="vertical-separator"></div>

            {state ? 'Pas dans friend' : (<Friends key="friends"></Friends>)}

        </div>
    )
}