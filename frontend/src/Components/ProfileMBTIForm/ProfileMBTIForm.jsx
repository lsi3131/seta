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

const NoMbtiRatio = () => {
    return (
        <div className={style.mbtiRatio}>
            <div className={style.noContentWarning}>
                <div className={style.warningText}>해당 유저의 MBTI가 없습니다</div>
                <div className={style.warningTextDetail}>mbti를 검사하여 세타의 다양한 기능을 즐겨보세요</div>
            </div>
        </div>
    )
}

const MbtiRatio = ({user}) => {
    return (
        <div className={style.mbtiRatio}>
            <ProfileChart percentPJ={user.percentPJ} percentIE={user.percentIE}
                          percentNS={user.percentNS} percentFT={user.percentFT}/>
        </div>
    )
}

const MbtiRanking = ({ranking}) => {
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
        <div className={style.followRanking}>
            <div className={style.rankingContanier}>
                <h3 className={style.rankingMbtiText}>{getRankText(ranking, 2)}</h3>
                <div className={style.second} style={{'--target-height': '70px'}}/>
            </div>
            <div className={style.rankingContanier}>
                <h3 className={style.rankingMbtiText}>{getRankText(ranking, 1)}</h3>
                <div className={style.first} style={{'--target-height': '120px'}}/>
            </div>
            <div className={style.rankingcontanier}>
                <h3 className={style.rankingMbtiText}>{getRankText(ranking, 3)}</h3>
                <div className={style.third} style={{'--target-height': '40px'}}/>
            </div>
        </div>
    )
}

const ProfileMBTIForm = ({user, followingRanks, followerRanks}) => {
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

    const isRankExists = (ranks) => {
        return ranks.length !== 0;
    }

    const isMbtiExists = (user) => {
        if (user === null) {
            return false;
        }

        return user.mbti && user.mbti !== '';
    }


    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div>
                <div className={style.container}>
                    <h3 className={style.title}>소개</h3>
                    <div className={style.introduce}>
                        {user.introduce ? (
                            <div>{user.introduce}</div>
                        ) : (
                            <div className={style.emptyIntroduce}>
                                <p>[자기소개 글을 작성하여 본인을 소개해주세요]</p>
                            </div>
                        )}
                    </div>

                </div>
                <div className={style.container}>
                <h3 className={style.title}>내 mbti 성향</h3>
                    {isMbtiExists(user) ? (
                        <MbtiRatio user={user}/>
                    ) : (
                        <NoMbtiRatio/>
                    )}
                </div>
            </div>
            <div>
                <div className={style.container}>
                    <h3 className={style.title}>내가 팔로우한 mbti 랭킹</h3>
                    {isRankExists(followingRanks) ? (
                        <MbtiRanking ranking={followingRanks}/>
                    ) : (
                        /* TODO: MBTI 팔로우 정보 없는 것 추가할 것 */
                        <NoMbtiRatio/>
                    )}
                </div>
                <div className={style.container}>
                    <h3 className={style.title}>나를 팔로우한 mbti 랭킹</h3>
                    {isRankExists(followerRanks) ? (
                        <MbtiRanking ranking={followerRanks}/>
                    ) : (
                        /* TODO: MBTI 팔로우 정보 없는 것 추가할 것 */
                        <NoMbtiRatio/>
                    )}

                </div>
            </div>
        </div>
    );
}
export default ProfileMBTIForm;
