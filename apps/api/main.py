import os
import re
import json
import requests
import httpx
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, List, Any
from langchain.agents import create_agent
from langchain.tools import tool
# from langchain_openrouter import ChatOpenRouter
# from langchain_groq import ChatGroq
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv()

CORS_ORIGINS = [origins.strip() for origins in os.getenv("CORS_ORIGINS").split(",")]
LLM_MODEL = os.getenv("LLM_MODEL")
LLM_URL = os.getenv("LLM_URL")
LLM_API_KEY = os.getenv("LLM_API_KEY")

app = FastAPI(title="API ai-social-agent", version="0.1.0")

# In-memory storage for conversation threads, mapping user_id to a list of message dicts
conversation_threads: Dict[str, List[Dict[str, str]]] = {}

def build_message_objects(thread: List[Dict[str, str]]):
    """Convert stored thread dicts to LangChain message objects.
    Supports user (HumanMessage) and assistant (AIMessage) roles.
    """
    msgs = []
    for m in thread:
        role = m.get("role")
        content = m.get("content", "")
        if role == "user":
            msgs.append(HumanMessage(content=content))
        elif role == "assistant":
            msgs.append(AIMessage(content=content))
    return msgs

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

@tool
async def fetch_webpage_content(url: str) -> str:
    """
    Extrai e retorna o conteúdo textual principal de uma página web a partir de uma URL fornecida.
    Utilizado para obter artigos, notícias ou textos de blog com o objetivo de resumir,
    analisar ou gerar conteúdo baseado no material encontrado.
    Retorna apenas o texto relevante, limpo de anúncios, menus e outros elementos de navegação.

    Args:
        url (str): A URL da página web.

    Returns:
        str: Texto limpo e legível extraído da página, ou mensagem de erro.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
    }
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
    
    soup = BeautifulSoup(response.text, "html.parser")

    for script in soup(["script", "style", "nav", "footer", "aside", "header", "link", "head"]):
        script.decompose()

    print(soup)
    
    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.split("\n")]
    clean_text = "\n".join(line for line in lines if line)

    return clean_text[:10000]


# model = ChatGroq(
#     model=LLM_MODEL,
#     api_key=LLM_API_KEY,
#     temperature=1,
#     output_version="v1",
# )
model = ChatNVIDIA(
    model=LLM_MODEL,
    api_key=LLM_API_KEY,
    temperature=1,
    top_p=0.9,
    output_version="v1",
)
# model = ChatOpenRouter(
#     model=LLM_MODEL,
#     api_key=OPENROUTER_API_KEY,
#     output_version="v1",
# )

system_message = SystemMessage(content=
    """
    Você é um Agente AI especializado em criação de conteúdo para redes sociais. Seu objetivo é ajudar o usuário a transformar informações de links (URLs) ou arquivos enviados (como PDFs) em posts impactantes, alinhados ao seu posicionamento e estilo.

    Sempre que o usuário enviar uma URL ou carregar um arquivo (ex: PDF), siga este fluxo:

    Resuma o conteúdo de forma clara, objetiva e fiel ao original. Destaque os pontos principais, temas centrais, dados relevantes e ideias-chave.

    Formule 2 a 3 perguntas estratégicas com o objetivo de entender:

    O posicionamento do usuário sobre os temas do texto (concorda? discorda? tem uma visão diferente?).
    O público-alvo que ele deseja atingir.
    O tom que prefere usar (provocativo, educativo, inspirador, humorístico, etc.).
    Exemplos:
    "Você concorda com a principal ideia do texto sobre [tema]? Como gostaria de posicionar-se em relação a isso?"
    "Esse conteúdo seria para seu público mais técnico ou leigo?"
    "Você gostaria de provocar debate ou transmitir conhecimento de forma neutra?"
    Sempre termine sua resposta com uma orientação prática, como:

    Uma sugestão de próximo passo (ex: "Agora que entendemos o tema, posso criar 3 rascunhos de posts com tons diferentes. Deseja seguir com isso?").
    Uma dica de engajamento (ex: "Incluir uma pergunta direta no post costuma aumentar interações. Que tal terminar com: 'Você concorda com isso?'").
    Um convite para refinamento (ex: "Se quiser, envie um exemplo de post que você gostou recentemente, para alinharmos o estilo.").
    🔁 Mantenha o tom profissional, empático e colaborativo. Nunca assuma opiniões pelo usuário. Seja um co-criador estratégico.

    Se o usuário não enviar nenhum conteúdo, peça educadamente:
    "Para começarmos, por favor, envie um link (URL) ou arquivo com o conteúdo que gostaria de transformar em posts. Posso ajudá-lo a extrair ideias e criar mensagens poderosas!"
"""
)

agent = create_agent(
    model=model,
    tools=[fetch_webpage_content],
    system_prompt=system_message,
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
    user_id: str


@app.post("/chat")
async def chat(data: ChatRequest):
    """
    Chat endpoint
    """
    # Retrieve or create conversation thread for this user
    thread = conversation_threads.setdefault(data.user_id, [])
    # Append the new user message to the thread
    thread.append({"role": "user", "content": data.message})
    # Invoke the agent with the full conversation history
    response = agent.invoke({"messages": thread})
    # Append the assistant's response to the thread for future context
    thread.append({"role": "assistant", "content": response})
    
    return {
        "status": "ok",
        "message": response
    }


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream chat endpoint with context support
    """
    # Retrieve or create conversation thread for this user
    thread = conversation_threads.setdefault(request.user_id, [])
    # Append the new user message to the thread
    thread.append({"role": "user", "content": request.message})
    # Build message objects (HumanMessage / AIMessage) from the thread
    messages = {"messages": build_message_objects(thread)}

    async def generator():
        full_response = ""
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
                full_response += text
                data = json.dumps({"chunk": text})
                print(data)
                yield f"data: {data}\n\n"
        # Append assistant response to thread for future context
        if full_response:
            thread.append({"role": "assistant", "content": full_response})
        # Signal end of stream
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
    Stream chat endpoint with context support
    """
    # Retrieve or create conversation thread for this user
    thread = conversation_threads.setdefault(request.user_id, [])
    # Append the new user message to the thread
    thread.append({"role": "user", "content": request.message})
    # Build message objects (HumanMessage / AIMessage) from the thread
    messages = {"messages": build_message_objects(thread)}

    async def generator():
        full_response = ""
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
                full_response += text
                data = json.dumps({"chunk": text})
                yield f"data: {data}\n\n"
        # Append assistant response to thread for future context
        if full_response:
            thread.append({"role": "assistant", "content": full_response})
        # Signal end of stream
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )