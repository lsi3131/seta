import React, {useEffect, useState} from 'react';
import style from "./PopupFilter.module.css"
import {getFontColor} from "../../Utils/helpers";


const PopupFilter = ({initialMbtiList, onApplyPopup, onClosePopup}) => {
    const [mbtiChecks, setMbtiChecks] = useState([
        {id: 1, label: 'INTJ', checked: false},
        {id: 2, label: 'INTP', checked: false},
        {id: 3, label: 'ENTP', checked: false},
        {id: 4, label: 'ENTJ', checked: false},
        {id: 5, label: 'INFJ', checked: false},
        {id: 6, label: 'INFP', checked: false},
        {id: 7, label: 'ENFJ', checked: false},
        {id: 8, label: 'ENFP', checked: false},
        {id: 9, label: 'ISTJ', checked: false},
        {id: 10, label: 'ISFJ', checked: false},
        {id: 11, label: 'ESTJ', checked: false},
        {id: 12, label: 'ESFJ', checked: false},
        {id: 13, label: 'ISTP', checked: false},
        {id: 14, label: 'ISFP', checked: false},
        {id: 15, label: 'ESTP', checked: false},
        {id: 16, label: 'ESFP', checked: false},
    ])

    useEffect(() => {
        setMbtiChecks(mbtiChecks.map(item =>
            initialMbtiList.some(m => m.toUpperCase() === item.label) ? {...item, checked: true} : item
        ));
    }, [initialMbtiList])

    const handleCheckboxChange = (id) => {
        const updatedCheckboxes = mbtiChecks.map((check) =>
            check.id === id ? {...check, checked: !check.checked} : check,
        )
        setMbtiChecks(updatedCheckboxes)

    }

    const handleApply = () => {
        const checkMbtiList = mbtiChecks
            .filter(check => check.checked === true)
            .map(check => check.label)

        onApplyPopup(checkMbtiList)
    }

    const clear = () => {
        const updatedCheckboxes = mbtiChecks.map(check => ({
            ...check,
            checked: false
        }));
        setMbtiChecks(updatedCheckboxes)
    }

    return (
        <div className={style.overlay}>
            <div className={style.popup}>
                <h2>보고 싶은 MBTI</h2>
                <div className={style.mbti}>
                    {mbtiChecks.map((check) => (
                        <div key={check.id}>
                            <div className={style.mbtibox}>
                                <input
                                    type="checkbox"
                                    id={`check-${check.id}`}
                                    value={check.label}
                                    checked={check.checked}
                                    onChange={() => handleCheckboxChange(check.id)}
                                    className={style.checkboxInput}
                                />
                                <label
                                    htmlFor={`check-${check.id}`}
                                    className={`${style.badgeLabel} ${check.checked ? style.checked : ''}`}
                                    style={{backgroundColor: check.checked ? getFontColor(check.label) : '#ccc'}}
                                >
                                    {check.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={style.mbti_button}>
                    <div className={style.mbti_button_left}>
                        <button className={style.button} style={{backgroundColor: "#994433"}} onClick={clear}>초기화
                        </button>
                    </div>
                    <div className={style.mbti_button_right}>
                        <button className={style.button} onClick={handleApply}>적용</button>
                        <button className={style.button} style={{backgroundColor: "#575757"}}
                                onClick={onClosePopup}>닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupFilter;
