import {Children, useEffect} from 'react';
import "../../css/popup.css"

type Props = {
    children: any,
    position? : {left: number, top: number},
    clear: any,
}
export default function PopUp({ children, position, clear }: Props) {

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (!document.querySelector(".popup-root").contains(event.target))
               clear();
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, );
    return (
        <div className="popup-root" style={position}>
            {Children.map(children, child =>
                <>
                {child}
                </>
            )}
        </div>
    );
}