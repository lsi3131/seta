def validate_chatroom_data(data):
    name = data.get('name')
    category_name = data.get('category')
    member_count = data.get('member_count')
    is_secret = data.get('is_secret')
    password = data.get('password')
    if not name:
        return {"error": "채팅방 이름을 입력해주세요."}
    if not category_name:
        return {"error": "유형을 선택해주세요."}
    if not member_count:
        return {"error": "최대 인원수를 선택해주세요."}
    if is_secret is None:
        return {"error": "비밀글 여부를 선택해주세요."}
    if is_secret and not password:
        return {"error": "비밀번호를 입력해주세요"}
    return None

