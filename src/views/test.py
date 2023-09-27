import requests

url = 'http://192.168.1.67:8080/api/v1/chat'
data = {
    "messages": [
        {"role": "user", "content": "什么是chatgpt"}
    ]
}
headers = {
    'Accept': 'text/event-stream',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MTY5OTY1OTY3MTM2MDUwMzgwOCwiaXNzIjoienR5IiwiZXhwIjoxNjk3MDMwNTMzfQ.LRCgPwzNAG3pN8U_paI9NrrI0nFt2IDXMwilIY9IEWM'
}

resp = requests.post(url, stream=True, json=data, headers=headers)
resp.encoding = resp.apparent_encoding

chunk_size = 1024
for data in resp.iter_content(chunk_size=chunk_size):
