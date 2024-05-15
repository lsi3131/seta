

def validate_comment_data(data):
    content = data.get('content')
    if not content:
        return {"error": "내용을 입력해주세요."}
    return None
