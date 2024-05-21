import React from "react";
import style from "./ProfileMBTIForm.module.css";
import { ResponsiveBar } from '@nivo/bar'

const data = [
    {
        "mbti": "EI",
        "E": 40,
        "I": 60,
    },
    {
        "mbti": "NS",
        "N": 90,
        "S": 10,
    },
    {
        "mbti": "TF",
        "T": 30,
        "F": 70,
    },
    {
        "mbti": "JP",
        "J": 80,
        "P": 20,
    },
]


const ProfileChart = ({ data }) => (
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
        padding={0.3}
        margin={{right: 30, left: 30 }}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#a9a9a9', '#d9d9d9']}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '1.2'
                ]
            ]
        }}
        axisTop={null}
        axisRight={{
            tickSize: 0,
            tickPadding: 7,
            format: value => ['I', 'S', 'F', 'P'].map((mbti, idx) => {
                return mbti
            }),
            tickRotation: 0,
            legendOffset: -46,
            truncateTickAt: 0
        }}
        axisBottom={null}
        axisLeft={{
            tickSize: 0,
            tickPadding: 7,
            format: value => ['E', 'N', 'T', 'J'].map((mbti, idx) => {
                return mbti
            }),
            tickRotation: 0,
            legendOffset: -46,
            truncateTickAt: 0
        }}
        enableGridY={false}
        labelSkipWidth={10}
        labelSkipHeight={10}
        labelTextColor="black"
        legends={[]}
        isInteractive={false}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in mbti: "+e.indexValue}
    />
)

const ProfileMBTIForm = () => {
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
    
    return (
        <div style={{ display:"flex", justifyContent: "space-around" }}>
            <div >
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

                    </div>
                </div>
                <div className={style.container}>
                    <h3 className={style.title}>나를 팔로우한 mbti 랭킹</h3>
                    <div className={style.followerRanking}>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfileMBTIForm;
