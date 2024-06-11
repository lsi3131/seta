from openai import OpenAI
from config.config import OPENAI_API_KEY
import json
import re

models = {
    'gpt-3.5-turbo': 'gpt-3.5-turbo'
}


def system_sub_instructions(member_count, user_description):
    text = f"""
    당신은 TRPG (Tabletop Role-Playing Game) 마스터입니다. 이 지시 사항을 주의 깊게 따르세요.
    """

    if user_description:
        text += f"""
        세계관은 다음과 같습니다.
        {user_description}
        """

    text += """
    롤을 위해 6면체 주사위를 사용하세요.
    각 상황은 주사위 굴림과 파티 멤버의 스탯으로 해결됩니다.
    각 상황에 대해 3가지 선택지를 제공합니다. 결과는 주사위 굴림과 스탯에 따라 달라집니다.
    파티 멤버의 스탯은 힘, 지능, 카리스마입니다.
    세계관, 플레이어 캐릭터를 매번 랜덤으로 생성합니다.
    다시 시작시 새로운 세계관, 플레이어 캐릭터를 생성합니다.
    """


    text += f"""
    게임이 시작되면 다음 단계를 따르세요:
    1. 세계관과 주요 장소에 대해 설명하세요.
    2. 플레이어 캐릭터는 반드시 {member_count}명을 생성하고 멤버의 스탯을 자동으로 할당하세요.
    3. 상황에 대한 선택지를 제공하세요.
    4. 선택을 하면 다음 상황과 새로운 선택지를 제시하세요.
    5. 선택에 따라 무작위로 스탯을 증가 또는 감소시키고, (+x) 또는 (-x)로 표시하세요.
    6. 응답은 예시는 반드시 다음과 같은 json 포맷으로 반환합니다. 클라이언트는 json.loads를 사용합니다. 
    """
    text += '''

===== 예시1=====
{"script": "[세계관]
에버가드 왕국은 평화롭던 시절을 뒤로하고 어둠의 세력에 의해 위협받고 있습니다. 최근 마을 주변에 괴물들이 출몰하며, 마을 사람들은 두려움에 떨고 있습니다.

[주요 장소]
- 에버가드 성: 왕국의 중심지이며, 왕 에드윈이 통치하고 있습니다.
- 이룬의 숲: 마을 근처에 위치한 깊고 어두운 숲. 여러 전설과 괴담이 존재합니다.
- 드래곤의 산: 먼 옛날 드래곤이 살았다는 전설이 있는 곳으로, 신비로운 보물이 숨겨져 있다는 소문이 있습니다.

[플레이어 캐릭터]
레오나: 인간 전사
- 힘(str): 11
- 지능(int): 12
- 카리스마(cha): 10

에릭: 엘프 궁수
- 힘(str): 14
- 지능(int): 12
- 카리스마(cha): 12

상황 1: 고대 유적 입구
당신의 파티는 오래된 유적의 입구에 도착했습니다. 입구를 통해 들어가기 위해 다음 선택지 중 하나를 선택하세요.
1.레오나가 힘을 사용해 입구의 문을 부순다.
2.에릭이 고대 언어로 적힌 비문을 해독해 문을 연다.
3.레오나가 문 주변을 조사하여 숨겨진 스위치를 찾는다.", "party": [{"name":"레오나", "str":11, "int":12, "cha":10},{"name":"에릭", "str":10, "int":13, "cha":12}], "end": 0}

===== 예시2 ====
{"script": "상황 1: 고대 유적 입구
당신은 레오나가 힘을 사용해 입구의 문을 부수기로 선택했습니다. 레오나의 힘 스탯(5)을 기준으로 6면체 주사위를 굴립니다.

주사위 결과:
(주사위 굴림: 4)

결과:
레오나가 문을 부수고 입구를 열었습니다. 그녀의 힘이 +1 증가합니다.

상황 2: 유적 내부의 함정
당신의 파티는 유적 내부로 들어왔습니다. 앞에는 여러 함정이 도사리고 있습니다. 다음 선택지 중 하나를 선택하세요.

1. 레오나가 앞장서서 함정을 몸으로 막아낸다.
2. 에릭이 함정을 무력화하는 마법을 시전한다.
3. 에릭이 함정을 피하며 안전한 길을 찾는다.
어떤 선택을 하시겠습니까?", "party": [{"name":"레오나", "str":12, "int":12, "cha":10},{"name":"에릭", "str":10, "int":13, "cha":12}],"end": 0}

===== 예시3  =====
{"script": "파티가 발견한 것은 마법 문양이 새겨진 보석입니다. 이 보석은 신비로운 힘을 품고 있을 것으로 짐작됩니다. 파티는 보석을 주워 가방에 넣고 다시 살피러 나타났던 길을 되돌아갑니다.
파티는 동굴을 탈출하며 마을로 향하게 됩니다. 보석을 획득한 파티는 여정을 마무리하고 여러 모험가들에게 이야기할만한 경험을 쌓았습니다.
[이야기를 마무리하며, 파티의 여정은 이만 끝이 납니다. 다음 모험을 기대해주세요!]

게임을 즐겨주셔서 감사합니다.", "party": [{"name":"레오나", "str":12, "int":12, "cha":10},{"name":"에릭", "str":10, "int":13, "cha":12}],"end": 1}
    '''
    print(text)
    return text


def system_sub_description(description):
    text = f"""
    게임 세계는 다음과 같이 설명됩니다:
    {description}
    """
    return text


class AIChatBot(object):

    def __init__(self, title, description, member_count):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.title = title
        self.member_count = member_count
        self.messages = [
            {
                "role": "system",
                "content": system_sub_instructions(member_count, description),
            },
            # {
            #     "role": "system",
            #     "content": system_sub_description(description),
            # }
        ]

    async def response(self, message):
        # Add the user message to the messages list
        self.messages.append({
            "role": "user",
            "content": message,
        })

        # Get the AI response
        completion = self.client.chat.completions.create(
            model=models['gpt-3.5-turbo'],
            messages=self.messages,
        )

        # Get the content of the AI response
        ai_message = completion.choices[0].message.content

        # Add the AI response to the messages list
        self.messages.append({
            "role": "assistant",
            "content": ai_message,
        })

        return ai_message
