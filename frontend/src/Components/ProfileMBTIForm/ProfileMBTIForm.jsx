import React, {useEffect, useState} from "react";
import style from "./ProfileMBTIForm.module.css";
import {ResponsiveBar} from '@nivo/bar'
import apiClient from "../../services/apiClient";


const ProfileChart = ({percentPJ = 50, percentFT = 50, percentNS = 50, percentIE = 50}) => {
    const [chartData, setChartData] = useState([
        {
            "mbti": "JP",
            "J": 50,
            "P": 50,
        },
        {
            "mbti": "TF",
            "T": 50,
            "F": 50,
        },
        {
            "mbti": "NS",
            "N": 50,
            "S": 50,
        },
        {
            "mbti": "EI",
            "E": 50,
            "I": 50,
        },
    ])

    const theme = {
        axis: {
            ticks: {
                text: {
                    fontSize: 20, // 축의 폰트 크기 설정
                },
            },
        },
    };

    useEffect(() => {
        let data = JSON.parse(JSON.stringify(chartData));
        data[0].P = Math.round(percentPJ)
        data[0].J = Math.round(100 - percentPJ)

        data[1].F = Math.round(percentFT)
        data[1].T = Math.round(100 - percentFT)

        data[2].N = Math.round(percentNS)
        data[2].S = Math.round(100 - percentNS)

        data[3].I = Math.round(percentIE)
        data[3].E = Math.round(100 - percentIE)

        setChartData(data)
    }, [percentPJ, percentFT, percentNS, percentIE]);

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

    return (
        <ResponsiveBar
            data={chartData}
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
            theme={theme}
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
}

const ProfileMBTIForm = ({user, followingRanks, followerRanks}) => {
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

    }, [user, followingRanks, followerRanks])

    const getRankText = (ranks, rankNum /* 1~3*/) => {
        /*
            ranks = [('ISFP', 3), ('ENFP', 2), ('ENTP, 5)]
         */
        const rankIndex = rankNum - 1;
        if (ranks.length <= rankIndex || 0 > rankIndex) {
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
                        <ProfileChart percentPJ={user.percentPJ} percentIE={user.percentIE}
                                      percentNS={user.percentNS} percentFT={user.percentFT}/>
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
