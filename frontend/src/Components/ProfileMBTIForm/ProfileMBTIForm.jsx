import React from "react";
import style from "./ProfileMBTIForm.module.css";

const ProfileMBTIForm = () => {
    return (
        <div style={{ display:"flex", justifyContent: "space-around" }}>
            <div >
                <div className={style.container}>
                    <h3>자기소개</h3>   
                    <div className={style.introduce}>

                    </div>

                </div>
                <div className={style.container}>
                    <h3>내 mbti 성향</h3>
                    <div className={style.mbtiRatio}>

                    </div>
                </div>
            </div>
            <div>
                <div className={style.container}>
                    <h3>내가 팔로우한 mbti 랭킹</h3>
                    <div className={style.followRanking}>

                    </div>
                </div>
                <div className={style.container}>
                    <h3>나를 팔로우한 mbti 랭킹</h3>
                    <div className={style.followerRanking}>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfileMBTIForm;
