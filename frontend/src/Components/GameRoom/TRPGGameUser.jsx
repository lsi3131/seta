import style from './TRPGGameUser.module.css'
import str from "../../Assets/images/game/trpg_str.png"
import int from "../../Assets/images/game/trpg_int.png"
import cha from "../../Assets/images/game/trpg_cha.png"
import {useEffect} from "react";


const TRPGGameUser = ({user}) => {

    useEffect(() => {
    }, [user]);

    return (
        <div className={style.container}>
            <h3>{user['name']}</h3>
            <img src={str} alt=""></img>
            <p>{user['str']}</p>
            <img src={int} alt=""></img>
            <p>{user['int']}</p>
            <img src={cha} alt=""></img>
            <p>{user['cha']}</p>
        </div>
    )
}

export default TRPGGameUser