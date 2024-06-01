def validate_chatroom_data(data):
    name = data.get('name')
    category_id = data.get('category_id')
    member_count = data.get('member_count')
    is_secret = data.get('is_secret')
    if not name:
        return {"error": "채팅방 이름을 입력해주세요."}
    if not category_id:
        return {"error": "유형을 선택해주세요."}
    if not member_count:
        return {"error": "최대 인원수를 선택해주세요."}
    if not is_secret:
        return {"error": "비밀글 여부를 선택해주세요."}
    return None

