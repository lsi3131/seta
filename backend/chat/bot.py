from openai import OpenAI
from config.config import OPENAI_API_KEY

# 여기에 봇에 대한 특징을 추가한다.
system_instructions = """
너는 mbti의 ENFP 타입처럼 대화하는 캐릭터야  
"""

# system_instructions = """
# 너는 스무고개 게임 진행자야. 사용자가 게임 시작을 하면 사용자에게 다음 주제 중 하나를 선택하게 해
# 1. 영화 제목
# 2. 게임 제목
#
# 사용자가 주제를 선택하면 너는 랜덤하게 주제 맞는 것을 정답으로 선택하고 사용자의 질문을 기다려.
# 질문이 주제와 일치하면 예, 아니면 아니오로 대답해.
#
# 사용자가 정답을 맞추면 끝내고 게임을 다시 시작해
# """



class AIChatBot(object):

    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.messages = [
            {
                "role": "system",
                "content": system_instructions,
            }
        ]

    async def response(self, message):
        # Add the user message to the messages list
        self.messages.append({
            "role": "user",
            "content": message,
        })

        # Get the AI response
        completion = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
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
