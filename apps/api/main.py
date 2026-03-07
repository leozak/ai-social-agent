import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain.agents import create_agent
from langchain.tools import tool
# from langchain_openrouter import ChatOpenRouter
# from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_groq import ChatGroq
from langchain.messages import SystemMessage, HumanMessage

load_dotenv()

CORS_ORIGINS = [origins.strip() for origins in os.getenv("CORS_ORIGINS").split(",")]
LLM_MODEL = os.getenv("LLM_MODEL")
LLM_URL = os.getenv("LLM_URL")
LLM_API_KEY = os.getenv("LLM_API_KEY")

app = FastAPI(title="API ai-social-agent", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

@tool
def get_weather(city: str) -> str:
    """Obtenha o clima de uma cidade específica."""
    return f"É sempre ensolarado em {city}!"

model = ChatGroq(
    model=LLM_MODEL,
    api_key=LLM_API_KEY,
    temperature=1,
    output_version="v1",
)
# model = ChatNVIDIA(
#     model=LLM_MODEL,
#     api_key=LLM_API_KEY,
#     temperature=1,
#     top_p=0.9,
#     output_version="v1",
# )
# model = ChatOpenRouter(
#     model=LLM_MODEL,
#     api_key=OPENROUTER_API_KEY,
#     output_version="v1",
# )

# system_message = SystemMessage(content=[{"type": "text", "text": f"Voce é um assistente útil"}])

agent = create_agent(
    model=model,
    tools=[get_weather],
    system_prompt=SystemMessage(content="Você é um assistente útil"),
)

@app.get("/")
async def root():
    """
    Health check
    """
    return {
        "status": "online",
        "message": "API ai-social-agent online"
    }

class ChatRequest(BaseModel):
    message: str



@app.post("/chat")
async def chat(data: ChatRequest):
    """
    Chat endpoint
    """
    # message = HumanMessage(content_blocks=[{"type": "text", "text": data.message}])
    # messages = [system_message, message]
    # response = agent.invoke(messages)

    response = agent.invoke(
        {"messages": [{"role": "user", "content": data.message}]}
    )

    print(response)

    print(data)
    return {
        "status": "ok",
        "message": response
    }



@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat endpoint
    """
    messages = {"messages":
        [            
            HumanMessage(content=request.message),
        ]
    }

    async def generator():
        async for chunk in agent.astream(messages):
            if "model" not in chunk:
                continue

            ai_message = chunk["model"]["messages"][-1]

            content = ai_message.content

            if isinstance(content, list):
                text = "".join(
                    block["text"]
                    for block in content
                    if block["type"] == "text"
                )
            elif isinstance(content, str):
                text = content
            else:
                continue

            if text:
                data = json.dumps({"chunk": text})
                print(data)
                yield f"data: {data}\n\n"
        
        # Sinaliza o fim da stream
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.post("/chat/stream_event")
async def chat_stream_event(request: ChatRequest):
    """
    Stream chat endpoint
    """
    messages = {"messages":
        [            
            HumanMessage(content=request.message),
        ]
    }

    async def generator():
        async for event in agent.astream_events(messages, output_version="v2"):
            if event["event"] != "on_chat_model_stream":
                continue

            chunk = event["data"]["chunk"]

            if isinstance(chunk.content, list):
                text = "".join(
                    block["text"]
                    for block in chunk.content
                    if block["type"] == "text"
                )
            elif isinstance(chunk.content, str):
                text = chunk.content
            else:
                continue

            if text:
                data = json.dumps({"chunk": text})
                print(data)
                yield f"data: {data}\n\n"
        
        # Sinaliza o fim da stream
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )