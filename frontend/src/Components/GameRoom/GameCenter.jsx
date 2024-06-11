import React, {useContext, useEffect, useState} from "react";
import style from "./GameCenter.module.css";
import GameScript from "./GameScript";
import {useGameContext} from "./GameProvider";
import GamePreview from "./GamePreview";
import {UserContext} from "../../userContext";
import GameSetting from "./GameSetting";



const GameCenter = () => {
    const {host, gameStep} = useGameContext()
    const currentUser = useContext(UserContext)

    useEffect(() => {
    }, [gameStep]);

    useEffect(() => {
        // const data = '{"script": "\n**세계 설정:**\n파티는 모험가로 이루어진 그룹으로, 신비한 마법이 깃든 환상적인 세계를 탐험하고 보물을 찾는 여정에 나서게 됩니다.\n\n**파티 멤버:**\n- 이름: 레오\n\n**파티원 스탯:**\n[레오]\n- 힘(str): 12\n- 지능(int): 11\n- 카리스마(cha): 13\n\n레오는 모험을 시작하기 전, 마을 광장에서 어떤 일을 할지 선택해야 합니다.\n\n**어떤 일을 하시겠습니까?**\n1. 시장에서 장비를 구매한다.\n2. 마을 사람들에게 이야기를 듣는다.\n3. 요술사의 점을 찾아간다.\n\n어떤 선택을 하시겠습니까? 1, 2, 3 중에서 선택해주세요.\n         ",\n"party": [\n    {"Name":"레오", "str":12, "int":11, "cha":13}\n],\n"end": 0\n}'
        // const newData = escapeJsonString(data)
        // console.log(newData)
        // const jsonData = JSON.parse(newData)
    }, []);

    return (
        <div className={style.container}>
            {gameStep === 'wait_setting' && (
                <>
                    {host === currentUser.username ? (
                        <>
                            <GameSetting/>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3>방장의 방 생성을 기다리세요...</h3>
                            </div>
                        </>
                    )}
                </>
            )}
            {gameStep === 'wait_start' && (
                <div>
                    <GamePreview/>
                </div>
            )}
            {gameStep === 'game_start' && (
                <GameScript/>
            )}

        </div>
    );
};

export default GameCenter;
