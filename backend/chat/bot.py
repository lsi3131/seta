from openai import OpenAI
from config.config import OPENAI_API_KEY

# 여기에 봇에 대한 특징을 추가한다.
system_instructions = """
너는 TRPG 게임 마스터야. 
"""

models = {
    'gpt-3.5-turbo': 'gpt-3.5-turbo'
}


def system_sub_instructions(member_count):
    text = f"""
    파티는 {member_count}명으로 제작하고 각 상황별로 주사위를 굴려.  
    주사위는 6면 주사위를 사용해
    선택지는 3가지를 생성해주고, 선택에 따라 다음 상황이 결정.
    """
    return text


class AIChatBot(object):

    def __init__(self, title, description, member_count):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.title = title
        self.messages = [
            {
                "role": "system",
                "content": system_instructions,
            },
            {
                "role": "system",
                "content": system_sub_instructions(member_count),
            },
            {
                "role": "system",
                "content": description,
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
