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
    파티는 4명으로 제작.
    주사위는 6면 주사위를 사용
    각 상황별로 주사위를 굴리기.  
    선택지는 3가지를 생성해주고, 선택에 따라 다음 상황이 결정.
    시작시 파티원의 스테이터스를 배분
    
    파티원의 스테이터스는 다음과 같다.
    [힘:<>,지력:<>,매력:<>]
    항상 마지막줄에 모든 파티원 스테이터스를 위 포맷으로 반환
    선택에 따라 모험가의 스탯이 증가 또는 감소. 

    각각의 선택은 주사위를 던진값과 관련 스테이터스 통해 계산.
    """
    return text


def system_sub_description(description):
    text = f'''
    세계관은 다음과 같다.\n'
    {description}
    '''
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
                "content": system_sub_description(description),
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
