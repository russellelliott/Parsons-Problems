## Running locally
`fetch` doesn't work in the `file://` protocol. You need to host a local webserver using this command. Enter this in the commandline:
```shell
python3 -m http.server
```
Page is hosted on port 8000
http://localhost:8000/index.html?specification=python.json


## Files
`index.html`: webpage for the activity
`script.js`: script for the problems, answer logic, progression, etc
`hint.js`: OpenAI-infused hint generation system
`print.js`: print the certificate
`style.css`: CSS styling

## Chats

### Bayleaf 1: Inital Setup
https://bayleaf.chat/s/4bd25c88-0cd1-4f6e-906d-c13db0cea9f7

### ChatGPT: Adjuting block drop logic
https://chatgpt.com/share/68027116-d0e8-800c-af64-7590f9a7416e

### Right color, wrong placement additional color logic, shuffle
https://chatgpt.com/share/6802b73c-5020-800c-9dc0-9061e0ecf302

### Zuplo API forwarding System
- https://dev.to/zuplo/rate-limiting-openai-requests-with-an-api-gateway-1m3e
- https://zuplo.com/blog/2023/02/27/protect-open-ai-api-keys
In vanilla javascript applications like this, API keys can be exposed, even with .env files. Zuplo allows it to be forwarded to a secure service that stores the API key for you. I've used this service before and it works quite well.

### Adding ChatGPT for writing hints
https://chatgpt.com/share/6802d09b-0854-800c-a919-e7d8abf67edd

### Some inspiration for additional problems
https://chatgpt.com/share/6802da9d-e80c-800c-a72a-ac8b12290563

### Creating and Printing the Certificate
https://chatgpt.com/share/6802e2dd-08b0-800c-b573-fe2ba5686e09

### Instructions
https://chatgpt.com/share/6802e6d8-f36c-800c-b119-9b4a95946ded

### Div Positioning
https://chatgpt.com/share/6802e6eb-319c-800c-bbbc-54612ff316b0

### Making more parsons problems
https://chatgpt.com/share/680e9d0a-d7f0-800c-8ea0-55fd1b051ab5