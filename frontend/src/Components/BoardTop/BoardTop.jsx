import style from "./BoardTop.module.css";
import React, {useEffect, useState} from "react";
import {getImage, getMainColor} from "../../Utils/helpers";
import apiClient from "../../services/apiClient";

const BoardTop = ({mbti}) => {
    const [description, setMbtiDescription] = useState('<DB의 mbti설명 >');

    useEffect(() => {
        handleGet();
    }, []);

    const handleGet = () => {
        /* mbti 설명 불러오기 */
        apiClient.get(`/api/accounts/mbti/${mbti}/`)
            .then(response => {
                setMbtiDescription(response.data['description'])
            })
            .catch(error => {
                console.error('Error during get description:', error)
            })
    }


    return (
        <div className={style.board_top} style={{background: getMainColor(mbti)}}>
            <div className={style.board_top_text_container}>
                <h3>{mbti.toUpperCase()}</h3>
                <p>{description}</p>
            </div>
            <div className={style.board_top_image}>
                <img className={style.board_top_image_size} src={getImage(mbti)} alt=""/>
            </div>
        </div>
    )
}

export default BoardTop;
