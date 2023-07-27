import TextInput from "../../../components/chat/TextInput";
import {useContext, useState} from "react";
import axios from "axios";
import Friend from "../../../components/chat/friend/Friend";
import {ApplicationContext} from "../../Auth";

export default function AddFriend(){
    const user = useContext(ApplicationContext)
    const [suggestions, setSuggestions] = useState([]);
    const [friend, setFriend] = useState(null);
    const handleInputChange = (event) => {
        let config = {
            method: 'get',
            url: 'http://localhost:3000/users/search/'+event.target.value,
            withCredentials: true,
        };
        if(event.target.value) {
            setFriend(null);
            axios(config).then((response) => {
                setSuggestions(response.data);
                if (response.data.length == 1 && event.target.value == response.data[0].username) {
                    setFriend(response.data[0]);
                }
            });
        }else
            setSuggestions(null);

    }

    const handleSuggestionClick = (friend) => {
        setFriend(friend)
    }

    const onButtonClick = () => {
        if (!friend) return ;

        const config = {
            method: 'post',
            url: 'http://localhost:3000/friend/friend-request/',
            withCredentials: true,
            data : {
                initiatorId: user.id,
                acceptorId: friend.id,
            }
        };
        axios(config)
        setFriend(null);
    }

    return (
        <>
            <div className="ajouter-text"> Ajouter</div>
            <div className="ajouter-description"> Tu peux ajouter des amis grâce à leurs noms d utilisateur. </div>
            <TextInput
                text={"Trouve ami.e, tape nom..."}
                onChange={event => handleInputChange(event)}
                buttonProps={{onClick: onButtonClick}}
                buttonContent="Envoyer une demande d’ami"
                friend={friend}
            />
            {suggestions?.map((current) => {return (<Friend onClick={handleSuggestionClick} key={current.username + "suggestion-key"} friend={current}/>)})}
        </>
    )
}