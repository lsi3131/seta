import json
import collections

# 원본 JSON 문자열
# data = '{"script": "aa\nbb"}'
#
# # \n을 \\n으로 변환
# data = data.replace('\n', '\\n')
#
# # JSON으로 파싱하여 확인
# parsed_data = json.loads(data)
# print(parsed_data)
#
# data = '{"script": "aa\\nbb"}'
# data = data.replace('\n', '\\n')
#
# parsed_data = json.loads(data)
# print(parsed_data)

dict = {
    'a': 1,
    'b': 2,
    'c': 1,
    'd': 2,
    'e': 2,
}

c = collections.Counter(dict.values())
print(c.most_common(1)[0][0])
