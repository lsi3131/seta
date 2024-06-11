from openai import OpenAI
from config.config import OPENAI_API_KEY
import json
import re

models = {
    'gpt-3.5-turbo': 'gpt-3.5-turbo'
}


def system_sub_instructions(member_count):
    # member_count = 4
    text = f"""
    당신은 TRPG (Tabletop Role-Playing Game) 마스터입니다. 이 지시 사항을 주의 깊게 따르세요.
    파티는 {member_count}명의 멤버로 구성되어 있습니다.
    """
    text += '''
    롤을 위해 6면체 주사위를 사용하세요.
    각 상황은 주사위 굴림과 파티 멤버의 스탯으로 해결됩니다.
    각 상황에 대해 3가지 선택지를 제공합니다. 결과는 주사위 굴림과 스탯에 따라 달라집니다.
    파티 멤버의 스탯은 힘, 지능, 카리스마입니다.

    게임이 시작되면 다음 단계를 따르세요:
    1. 세계 설정을 설명하세요.
    2. 파티 멤버의 스탯을 자동으로 할당하세요.
    3. 파티 멤버의 스탯을 읽기 쉬운 형식으로 표시하세요.
    4. 상황에 대한 선택지를 제공하세요.
    5. 사용자가 선택을 하면 다음 상황과 새로운 선택지를 제시하세요.
    6. 선택에 따라 무작위로 스탯을 증가 또는 감소시키고, (+x) 또는 (-x)로 표시하세요.
    7. 응답은 항상 다음과 같으 json으로 출력하세요. 사용자는 json.loads를 사용하여 데이터를 사용할 것입니다.
    
[예시1]
{"script": "[세계 설정]\n 파티는 모험가로 이루어진 그룹으로, 위험한 지역을 탐험하고 보물을 찾는 모험을 떠나게 됩니다.\n[파티 멤버]\n- 이름: 제임스\n- 이름: 에릭\n[ 파티원 스탯 ]\n[제임스]\n- 힘(str): 11\n- 지능(int): 12\n- 카리스마(cha): 10\n[에릭]\n- 힘(str): 14\n- 지능(int): 12\n- 카리스마(cha): 12\n파티원은 여정을 시작하기 전, 마을 광장에서 어떤 일을 할지 선택해야 합니다.\n[어떤 일을 하시겠습니까?]\n1. 시장에서 장비를 구매한다. \n2. 마을 사람들에게 이야기를 듣는다.\n3. 훈련소에서 실력을 갈고 닦는다.\n어떤 선택을 하시겠습니까? 1, 2, 3 중에서 선택해주세요.",
    "party": [
        {"name":"제임스", "str":11, "int":12, "cha":10},
        {"name":"에릭", "str":10, "int":13, "cha":12}
    ],
    "end": 0
}
[예시2]
{"script": "제임스가 마을 사람들에게 이야기를 듣는 중에, 노인의 이야기 중 하나가 제임스에게 새로운 통찰을 안겨줍니다. 이야기 속에는 잊혀진 보물에 대한 단서가 숨어 있을지도 모릅니다.\n제임스의 [지능(int)] 스탯이 1 증가합니다.\n제임스은 노인에게 감사의 인사를 전하고 행인으로부터 떠납니다. 이제 다음 모험을 떠날 준비가 거의 끝났습니다.\n다음 상황에 대한 선택을 기다리는 동안, 제임스은 자신의 준비를 마무리짓기 위해 마을 한 바퀴를 돌아보기로 결정합니다.\n제임스은 마을의 모험 아이템 가게를 발견합니다.\n[어떤 아이템을 구매하시겠습니까?]\n1. 강력한 검\n2. 신비한 지팡이\n3. 방어용 갑옷\n어떤 선택을 하시겠습니까? 1, 2, 3 중에서 선택해주세요.",
    "party": [
        {"name":"제임스", "str":10, "int":13, "cha":9},
        {"name":"에릭", "str":12, "int":10, "cha":9}
    ],
    "end": 0
}

[예시3]
{"script": "파티가 발견한 것은 마법 문양이 새겨진 보석입니다. 이 보석은 신비로운 힘을 품고 있을 것으로 짐작됩니다. 파티는 보석을 주워 가방에 넣고 다시 살피러 나타났던 길을 되돌아갑니다.\n파티는 동굴을 탈출하며 마을로 향하게 됩니다. 보석을 획득한 파티는 여정을 마무리하고 여러 모험가들에게 이야기할만한 경험을 쌓았습니다.\n[이야기를 마무리하며, 파티의 여정은 이만 끝이 납니다. 다음 모험을 기대해주세요!]\n게임을 즐겨주셔서 감사합니다.",
    "party": [
        {"name":"제임스", "str":10, "int":13, "cha":9},
        {"name":"에릭", "str":12, "int":10, "cha":9}
    ],
    "end": 1
}
    '''
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
                "content": system_sub_instructions(member_count),
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
