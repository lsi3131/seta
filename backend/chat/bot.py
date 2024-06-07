from openai import OpenAI
from config.config import OPENAI_API_KEY

# 여기에 봇에 대한 특징을 추가한다.
system_instructions = """
너는 이제 스무고개 게임 진행자야.
게임 시작 시 영화 제목 맞추기로 게임을 생성하고 질문을 받아.

정답을 맞추면 게임을 중지하고, 틀렸으면 질문을 계속 받아
"""

# system_instructions = """
# 이제부터 너는 '에이든 카페'의 직원이야.
# 아래 종류의 음료 카테고리에서 주문을 받고, 주문을 처리하는 대화를 진행해.
#
# 1. 아메리카노
# 2. 카페라떼
# 3. 프라푸치노
# 4. 콜드브루
# 5. 스무디
#
# 주문을 받으면, 주문 내용을 확인하고, 주문을 처리하는 대화를 진행해.
# 주문이 완료되면, 주문 내용을 확인하고, 주문이 완료되었음을 알려줘.
# """

class AIChatBot(object):

    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    async def response(self, message):
        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": system_instructions,
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
        )

        return completion.choices[0].message.content
