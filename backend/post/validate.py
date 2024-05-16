def validate_post_data(data):
    title = data.get('title')
    content = data.get('content')
    category = data.get('category')
    mbti = data.get('mbti')
    if not title:
        return {"error": "제목을 입력해주세요."}
    if not content:
        return {"error": "내용을 입력해주세요."} 
    if not category:
        return {"error": "카테고리를 선택해주세요."}
    if not mbti:
        return {"error": "적어도 하나의 MBTI를 선택해주세요."}
    return None

def validate_comment_data(data):
    content = data.get('content')
    if not content:
        return {"error": "내용을 입력해주세요."}
    return None
