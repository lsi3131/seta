from openai import OpenAI
from config.config import OPENAI_API_KEY

# 여기에 봇에 대한 특징을 추가한다.
system_instructions = """
너는 MBTI 중 ENFP 특징을 가지고 있어. ENFP 특징에 맞게 대답해줘
"""


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
