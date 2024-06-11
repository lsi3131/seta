import style from './TRPGGameUser.module.css'
import str from "../../Assets/images/game/trpg_str.png"
import int from "../../Assets/images/game/trpg_int.png"
import cha from "../../Assets/images/game/trpg_cha.png"
import React, {useEffect} from "react";

const TRPGGameUserList = ({users}) => {
    return (
        <div className={style.userListContainer}>
            <div className={style.userListTitle}>
                <h2>유저</h2>
            </div>
            <div className={style.userList}>
                {users.map((user, index) => (
                    <div key={index}>
                        <TRPGGameUser user={user}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const TRPGGameUser = ({user}) => {

    useEffect(() => {
    }, [user]);

    return (
        <div className={style.container}>
            <div className={style.name}>
                <h3>{user['name']}</h3>
            </div>
            <div className={style.stats}>
            <img src={str} alt=""></img>
                <p>{user['str']}</p>
                <img src={int} alt=""></img>
                <p>{user['int']}</p>
                <img src={cha} alt=""></img>
                <p>{user['cha']}</p>
            </div>
        </div>
    )
}

export default TRPGGameUserList