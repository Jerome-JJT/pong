import React from "react";

import '../../css/homepage.css'

export const LaunchButton = (): JSX.Element => {
    const searchGame = () => {
        console.log("i wanna play");
        //to code with back (ev some more front)
    };

    return (
        <button className="play-button" onClick={searchGame}>
            PLAY </button>
    );
};