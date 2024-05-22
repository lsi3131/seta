import React, {useEffect, useState} from "react";
import style from "./ProfileMBTIForm.module.css";
import {ResponsiveBar} from '@nivo/bar'
import apiClient from "../../services/apiClient";

const data = [
    {
        "mbti": "JP",
        "J": 80,
        "P": 20,
    },
    {
        "mbti": "TF",
        "T": 30,
        "F": 70,
    },
    {
        "mbti": "NS",
        "N": 90,
        "S": 10,
    },
    {
        "mbti": "EI",
        "E": 10,
        "I": 90,
    },
]

const entjFormat = (value) => {
    if (value === 'EI') {
        return 'E';
    } else if (value === 'NS') {
        return 'N';
    } else if (value === 'TF') {
        return 'T';
    } else if (value === 'JP') {
        return 'J';
    }
}

const isfpFormat = (value) => {
    if (value === 'EI') {
        return 'I'
    } else if (value === 'NS') {
        return 'S';
    } else if (value === 'TF') {
        return 'F';
    } else if (value === 'JP') {
        return 'P';
    }
}


const ProfileChart = ({data}) => (
    <ResponsiveBar
        data={data}
        keys={[
            'E',
            'I',
            'N',
            'S',
            'T',
            'F',
            'J',
            'P'
        ]}
        indexBy="mbti"
        theme={{
            fontSize: '20px',
        }}
        padding={0.3}
        margin={{right: 20, left: 20}}
        layout="horizontal"
        valueScale={{type: 'linear'}}
        indexScale={{type: 'band', round: true}}
        colors={['#a9a9a9', '#d9d9d9']}
        borderWidth={2}
        borderColor={{theme: 'background'}}
        axisTop={null}
        axisRight={{
            tickSize: 0,
            tickPadding: 7,
            format: value => `${isfpFormat(value)}`,
            tickRotation: 0,
            legendOffset: -46,
            truncateTickAt: 0,
        }}
        axisBottom={null}
        axisLeft={{
            tickSize: 0,
            tickPadding: 7,
            format: value => `${entjFormat(value)}`,
            tickRotation: 0,
            legendOffset: -46,
            truncateTickAt: 0,
        }}
        enableGridY={false}
        labelSkipWidth={10}
        labelSkipHeight={10}
        labelTextColor="black"
        legends={[]}
        isInteractive={false}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e => e.id + ": " + e.formattedValue + " in mbti: " + e.indexValue}
    />
)

const ProfileMBTIForm = ({followingRanks, followerRanks}) => {
    const introduce = `난 너를 믿었던만큼 난 내 친구도 믿었기에
    난 아무런 부담없이 널 내 친구에게 소개시켜 줬고
    그런 만남이 있은 후부터 우리는 자주 함께 만나며
    즐거운 시간을 보내며 함께 어울렸던 것뿐인데 그런 만남이 어디부터 잘못됐는지
    난 알 수 없는 예감에 조금씩 빠져들고 있을때쯤
    넌 나보다 내 친구에게 관심을 더 보이며
    날 조금씩 멀리하던 그 어느 날 너와 내가 심하게 다툰 그 날 이후로
    너와 내 친구는 연락도 없고 날 피하는 것 같아
    그제서야 난 느낀거야 모든 것이 잘못돼 있는걸
    너와 내 친구는 어느새 다정한 연인이 돼 있었지`

    useEffect(() => {

    }, [followingRanks, followerRanks])

    const getRankText = (ranks, rankNum /* 1~3*/) => {
        /*
            ranks = [('ISFP', 3), ('ENFP', 2), ('ENTP, 5)]
         */
        const rankIndex = rankNum - 1;
        if(ranks.length <= rankIndex || 0 > rankIndex) {
            return "아직은 없어요";
        }

        return ranks[rankIndex][0].toUpperCase();
    }


    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div>
                <div className={style.container}>
                    <h3 className={style.title}>자기소개</h3>
                    <div className={style.introduce}>
                        <h4>{introduce}</h4>
                    </div>

                </div>
                <div className={style.container}>
                    <h3 className={style.title}>내 mbti 성향</h3>
                    <div className={style.mbtiRatio}>
                        <ProfileChart data={data}/>
                    </div>
                </div>
            </div>
            <div>
                <div className={style.container}>
                    <h3 className={style.title}>내가 팔로우한 mbti 랭킹</h3>
                    <div className={style.followRanking}>
                        <div className={style.rankingContanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followingRanks, 2)}</h3>
                            <div className={style.second} style={{'--target-height': '70px'}}/>
                        </div>
                        <div className={style.rankingContanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followingRanks, 1)}</h3>
                            <div className={style.first} style={{'--target-height': '120px'}}/>
                        </div>
                        <div classname={style.rankingcontanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followingRanks, 3)}</h3>
                            <div className={style.third} style={{'--target-height': '40px'}}/>
                        </div>
                    </div>
                </div>
                <div className={style.container}>
                    <h3 className={style.title}>나를 팔로우한 mbti 랭킹</h3>
                    <div className={style.followerRanking}>
                        <div className={style.rankingContanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followerRanks, 2)}</h3>
                            <div className={style.second} style={{'--target-height': '70px'}}/>
                        </div>
                        <div className={style.rankingContanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followerRanks, 1)}</h3>
                            <div className={style.first} style={{'--target-height': '120px'}}/>
                        </div>
                        <div className={style.rankingContanier}>
                            <h3 className={style.rankingMbtiText}>{getRankText(followerRanks, 3)}</h3>
                            <div className={style.third} style={{'--target-height': '40px'}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfileMBTIForm;
