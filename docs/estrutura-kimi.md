# Design do Projeto: AI Social Media Agent

Vou ajudá-lo a estruturar uma arquitetura robusta, extensível e alinhada com as melhores práticas para agentes de IA. Dado o escopo (análise de conteúdo, entrevista do usuário e geração de ações sociais), precisamos de um design que separe bem **orquestração**, **ferramentas** e **memória**.

---

## 1. Visão Arquitetural Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │  Dashboard  │  │  Interview  │  │ Content Browser  │ │
│  │   (Posts)   │  │   (Chat)    │  │  (URLs/Feeds)  │ │
│  └─────────────┘  └─────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   API LAYER (FastAPI)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │    Auth     │  │   Webhooks  │  │   Streaming    │ │
│  │  (Clerk/    │  │  (X/Other)  │  │   (SSE/WS)     │ │
│  │  Supabase)  │  │             │  │                │ │
│  └─────────────┘  └─────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              ORQUESTRAÇÃO DE AGENTES                    │
│              (LangGraph / DeepAgents)                   │
│                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐   ┌──────┐ │
│  │ Analyzer│───▶│Interviewer│───▶│ Creator │──▶│Actor │ │
│  │  Agent  │    │  Agent   │    │  Agent  │   │ Agent│ │
│  └─────────┘    └─────────┘    └─────────┘   └──────┘ │
│       │                              │          │     │
│       └──────────────────────────────┴──────────┘     │
│                    (Shared Memory / State)              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              INFRAESTRUTURA E TOOLS                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────┐ │
│  │ LLM     │  │ Browser │  │   X     │  │ Vector    │ │
│  │Router   │  │ (Scrape)│  │  API    │  │  Store    │ │
│  │(Multi)  │  │         │  │         │  │(Memória)  │ │
│  └─────────┘  └─────────┘  └─────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Estrutura de Codebase

```
ai-social-agent/
├── apps/
│   ├── web/                          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── interview/        # Fluxo de entrevista
│   │   │   │   ├── content-input/    # URL feeds, drag-drop
│   │   │   │   ├── post-editor/      # Editor de posts gerados
│   │   │   │   └── analytics/        # Métricas de engajamento
│   │   │   ├── hooks/
│   │   │   │   ├── useAgentStream.ts # SSE para respostas streaming
│   │   │   │   └── useInterview.ts   # Gerenciamento de estado da entrevista
│   │   │   ├── stores/
│   │   │   │   └── user-profile.ts   # Zustand: persona, posicionamentos
│   │   │   └── lib/
│   │   │       └── api-client.ts     # TanStack Query + fetch
│   │   └── package.json
│   │
│   └── api/                          # FastAPI backend
│       ├── src/
│       │   ├── api/
│       │   │   ├── v1/
│       │   │   │   ├── router.py
│       │   │   │   ├── endpoints/
│       │   │   │   │   ├── agents.py     # Streaming de execução
│       │   │   │   │   ├── interview.py  # Sessões de entrevista
│       │   │   │   │   ├── posts.py      # CRUD de posts gerados
│       │   │   │   │   └── webhooks.py   # X webhooks
│       │   │   │   └── dependencies/
│       │   │   │       ├── auth.py
│       │   │   │       └── rate_limit.py
│       │   │
│       │   ├── agents/               # 🧠 NÚCLEO DOS AGENTES
│       │   │   ├── graph.py          # LangGraph: definição do fluxo
│       │   │   ├── nodes/
│       │   │   │   ├── analyze_content.py
│       │   │   │   ├── interview_user.py
│       │   │   │   ├── generate_posts.py
│       │   │   │   ├── generate_replies.py
│       │   │   │   └── execute_action.py   # (com aprovação humana)
│       │   │   ├── edges/
│       │   │   │   └── routing_logic.py    # Decisões de fluxo
│       │   │   ├── tools/
│       │   │   │   ├── web_search.py
│       │   │   │   ├── scrape_url.py
│       │   │   │   └── social_actions.py   # Postar, comentar, curtir
│       │   │   └── memory/
│       │   │       ├── thread_store.py     # PostgreSQL + pgvector
│       │   │       └── user_profile.py     # Schema da persona
│       │   │
│       │   ├── llm/                  # 🔄 ABSTRAÇÃO MULTI-LLM
│       │   │   ├── router.py         # Seleciona provedor por custo/qualidade
│       │   │   ├── providers/
│       │   │   │   ├── openai.py
│       │   │   │   ├── anthropic.py
│       │   │   │   ├── google.py     # Gemini (custo zero inicial!)
│       │   │   │   ├── groq.py       # Velocidade para prototyping
│       │   │   │   └── local.py      # Ollama para dev/teste
│       │   │   └── models/
│       │   │       └── schemas.py      # Unified response format
│       │   │
│       │   ├── integrations/         # 🔌 REDES SOCIAIS (Plugin system)
│       │   │   ├── base.py           # Abstract base class
│       │   │   ├── registry.py       # Dynamic loading
│       │   │   └── platforms/
│       │   │       ├── x/            # Twitter/X (primário)
│       │   │       │   ├── client.py
│       │   │       │   ├── webhooks.py
│       │   │       │   └── rate_limiter.py
│       │   │       ├── linkedin/     # (futuro: stub)
│       │   │       └── instagram/    # (futuro: stub)
│       │   │
│       │   ├── services/
│       │   │   ├── content_scraper.py    # Crawlee / Playwright
│       │   │   ├── engagement_tracker.py # Métricas de posts
│       │   │   └── scheduler.py          # Agendamento de ações
│       │   │
│       │   └── core/
│       │       ├── config.py
│       │       ├── database.py
│       │       └── logging.py
│       │
│       └── pyproject.toml
│
├── packages/
│   ├── shared-types/               # TypeScript + Python (via Pydantic)
│   ├── ui-components/              # Design system (shadcn/ui base)
│   └── ts-config/                  # Configs compartilhadas
│
├── infra/
│   ├── docker/
│   ├── terraform/                  # (futuro)
│   └── k8s/                        # (futuro)
│
└── README.md
```

---

## 3. Stack Tecnológico Detalhado

### Frontend (React)

| Categoria     | Biblioteca                  | Motivação                                   |
| ------------- | --------------------------- | ------------------------------------------- |
| Framework     | **Next.js 14 (App Router)** | SSR para SEO, streaming, API routes         |
| Estado Global | **Zustand**                 | Leve, sem boilerplate, persistência fácil   |
| Server State  | **TanStack Query**          | Cache inteligente, background updates       |
| Streaming     | **Vercel AI SDK**           | `useChat`, `useCompletion` prontos para SSE |
| UI Components | **shadcn/ui**               | Acessibilidade + customização total         |
| Forms         | **React Hook Form + Zod**   | Validação type-safe                         |
| Animações     | **Framer Motion**           | Transições suaves no fluxo de entrevista    |

### Backend (Python/FastAPI)

| Categoria  | Biblioteca                             | Motivação                                   |
| ---------- | -------------------------------------- | ------------------------------------------- |
| Framework  | **FastAPI**                            | Async nativo, OpenAPI automático            |
| Agentes    | **LangGraph**                          | Controle de fluxo complexo, ciclos, estados |
| Memória    | **LangMem** ou **Postgres + pgvector** | Checkpointer nativo do LangGraph            |
| Scraping   | **Crawlee** (Python) ou **Playwright** | JavaScript-heavy sites                      |
| Scheduling | **Celery + Redis** ou **Temporal**     | Tarefas background confiáveis               |
| Auth       | **Clerk SDK**                          | JWT validation, webhooks de usuário         |

---

## 4. Sistema Multi-LLM: Estratégia de Roteamento

Dado que você começará com cotas gratuitas, implemente um **roteador inteligente**:

```python
# llm/router.py
from enum import Enum
from dataclasses import dataclass

class TaskType(Enum):
    ANALYZE_CONTENT = "analyze"      # Qualidade > Velocidade
    INTERVIEW = "interview"          # Qualidade + Contexto longo
    GENERATE_POST = "generate"       # Criatividade + segurança
    QUICK_REPLY = "quick"            # Velocidade > Qualidade
    SUMMARIZE = "summarize"          # Custo baixo

class Tier(Enum):
    FREE = "free"        # Gemini, Groq
    STANDARD = "standard" # GPT-4o-mini, Claude 3 Haiku
    PREMIUM = "premium"   # GPT-4o, Claude 3.5 Sonnet

@dataclass
class RoutingDecision:
    provider: str      # "google", "openai", "anthropic", "groq"
    model: str
    tier: Tier
    estimated_cost_usd: float

class LLMRouter:
    """
    Roteia para o LLM ótimo baseado em:
    - Tipo de tarefa
    - Disponibilidade de cota gratuita
    - Preferência de qualidade vs. custo
    """

    async def route(self, task: TaskType, content_length: int) -> RoutingDecision:
        # Lógica: Interview precisa de contexto longo → Gemini
        # Quick reply precisa de velocidade → Groq
        # Generate post precisa de segurança → Claude ou GPT-4o

        if task == TaskType.QUICK_REPLY:
            if await self.groq.has_quota():
                return RoutingDecision("groq", "llama-3-70b", Tier.FREE, 0.0)

        if task == TaskType.INTERVIEW and content_length > 100000:
            if await self.google.has_quota():
                return RoutingDecision("google", "gemini-1.5-flash", Tier.FREE, 0.0)

        # Fallback pago
        return RoutingDecision("anthropic", "claude-3-5-sonnet-20241022", Tier.PREMIUM, 0.003)
```

### Configuração Inicial para Desenvolvimento

| Provedor          | Uso Inicial                            | Fallback     |
| ----------------- | -------------------------------------- | ------------ |
| **Google Gemini** | Entrevistas, análise de conteúdo longo | GPT-4o-mini  |
| **Groq**          | Geração rápida de rascunhos, replies   | Gemini Flash |
| **OpenAI**        | Validação final, safety checks         | Claude 3.5   |

---

## 5. Arquitetura de Agentes com LangGraph

O fluxo do seu agente não é linear. Precisa de **ciclos** (entrevista iterativa) e **gateways humanos** (aprovação antes de postar).

```python
# agents/graph.py
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated, Sequence
import operator

class AgentState(TypedDict):
    # Input
    content_urls: list[str]
    scraped_content: list[dict]

    # Entrevista (cíclico)
    user_responses: Annotated[list, operator.add]
    interview_complete: bool
    user_profile: dict  # Persona construída

    # Geração
    generated_posts: list[dict]
    selected_post_idx: int | None

    # Ação
    action_approved: bool | None  # Human-in-the-loop
    action_result: dict

def create_graph():
    builder = StateGraph(AgentState)

    # Nós
    builder.add_node("scrape", scrape_content_node)
    builder.add_node("analyze", analyze_content_node)
    builder.add_node("interview", interview_user_node)      # ← Pode loop
    builder.add_node("generate", generate_posts_node)
    builder.add_node("human_review", human_approval_node)   # ← Interrupt
    builder.add_node("execute", execute_action_node)

    # Edges
    builder.set_entry_point("scrape")
    builder.add_edge("scrape", "analyze")
    builder.add_edge("analyze", "interview")

    # Ciclo de entrevista: continua até complete=True
    builder.add_conditional_edges(
        "interview",
        lambda s: "generate" if s["interview_complete"] else "interview",
        {"interview": "interview", "generate": "generate"}
    )

    builder.add_edge("generate", "human_review")

    # Gateway humano: aprova ou rejeita
    builder.add_conditional_edges(
        "human_review",
        lambda s: "execute" if s["action_approved"] else "generate",
        {"execute": "execute", "generate": "generate"}
    )

    builder.add_edge("execute", END)

    return builder.compile(checkpointer=MemorySaver())

# Execução com streaming para o frontend
async def run_agent_stream(config: dict, content_urls: list[str]):
    graph = create_graph()
    initial_state = {"content_urls": content_urls}

    async for event in graph.astream(initial_state, config):
        # Envia para frontend via SSE
        yield {
            "node": event["__name__"],
            "data": event.get("data"),
            "requires_input": event.get("__interrupt__") is not None
        }
```

---

## 6. Sistema de Integrações Sociais (Plugin Architecture)

Para adicionar LinkedIn, Instagram, etc., sem refatorar:

```python
# integrations/base.py
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class SocialPost:
    content: str
    media_urls: list[str] | None = None
    reply_to_id: str | None = None
    thread_id: str | None = None

@dataclass
class EngagementMetrics:
    likes: int
    replies: int
    reposts: int
    impressions: int

class SocialPlatform(ABC):
    name: str
    max_chars: int
    supports_media: bool
    supports_threads: bool

    @abstractmethod
    async def publish(self, post: SocialPost) -> dict:
        """Publica e retorna ID + URL"""

    @abstractmethod
    async def reply(self, post_id: str, content: str) -> dict:
        """Responde a post existente"""

    @abstractmethod
    async def engage(self, target_post_id: str, action: str) -> dict:
        """Curtir, repostar, etc."""

    @abstractmethod
    async def get_metrics(self, post_id: str) -> EngagementMetrics:
        """Busca métricas de engajamento"""

    @abstractmethod
    async def stream_mentions(self, user_id: str) -> AsyncIterator[dict]:
        """Webhook/alerts para menções do usuário"""

# Registry para carregamento dinâmico
class PlatformRegistry:
    def __init__(self):
        self._platforms: dict[str, SocialPlatform] = {}

    def register(self, platform: SocialPlatform):
        self._platforms[platform.name] = platform

    def get(self, name: str) -> SocialPlatform:
        return self._platforms[name]

    def list_available(self) -> list[str]:
        return list(self._platforms.keys())
```

### Implementação X (Twitter)

```python
# integrations/platforms/x/client.py
import tweepy
from ..base import SocialPlatform, SocialPost, EngagementMetrics

class XPlatform(SocialPlatform):
    name = "x"
    max_chars = 280  # ou 4000 para Blue
    supports_media = True
    supports_threads = True

    def __init__(self, api_key: str, api_secret: str,
                 access_token: str, access_secret: str):
        self.client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_secret
        )
        # v1.1 API para media upload
        auth = tweepy.OAuth1UserHandler(api_key, api_secret,
                                         access_token, access_secret)
        self.api_v1 = tweepy.API(auth)

    async def publish(self, post: SocialPost) -> dict:
        # Upload de mídia primeiro, se houver
        media_ids = []
        if post.media_urls:
            for url in post.media_urls:
                media = self.api_v1.media_upload(filename=url)  # simplificado
                media_ids.append(media.media_id)

        response = self.client.create_tweet(
            text=post.content,
            media_ids=media_ids if media_ids else None
        )
        return {
            "id": response.data["id"],
            "url": f"https://x.com/i/web/status/{response.data['id']}"
        }

    async def reply(self, post_id: str, content: str) -> dict:
        response = self.client.create_tweet(
            text=content,
            in_reply_to_tweet_id=post_id
        )
        return {"id": response.data["id"]}

    async def get_metrics(self, post_id: str) -> EngagementMetrics:
        tweet = self.client.get_tweet(
            post_id,
            tweet_fields=["public_metrics"]
        )
        m = tweet.data.public_metrics
        return EngagementMetrics(
            likes=m["like_count"],
            replies=m["reply_count"],
            reposts=m["retweet_count"],
            impressions=m["impression_count"]
        )
```

---

## 7. Schema de Memória: User Profile

A "alma" do seu app é a persona capturada na entrevista. Modele bem:

```python
# memory/user_profile.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal

class ToneDimension(BaseModel):
    formal_casual: float = Field(ge=0, le=1)  # 0=casual, 1=formal
    emotional_rational: float = Field(ge=0, le=1)
    provocative_diplomatic: float = Field(ge=0, le=1)
    humorous_serious: float = Field(ge=0, le=1)

class ContentPreferences(BaseModel):
    preferred_topics: list[str]
    avoided_topics: list[str]
    preferred_formats: list[Literal["thread", "single", "poll", "image_caption"]]
    optimal_posting_times: list[str]  # ["09:00", "18:00"] TZ do usuário

class EngagementStyle(BaseModel):
    reply_to_mentions: bool
    proactive_engagement: bool  # Comentar em posts de outros
    engagement_targets: list[str]  # Tipos de conta para engajar

    daily_limits: dict[str, int] = {
        "posts": 5,
        "replies": 20,
        "proactive_comments": 10
    }

class UserProfile(BaseModel):
    user_id: str
    created_at: datetime
    updated_at: datetime

    # Identidade
    name: str
    bio_summary: str  # 1-2 frases, gerado pelo agente
    expertise_areas: list[str]
    target_audience: str

    # Voz e Tom
    tone: ToneDimension
    signature_phrases: list[str]  # Expressões que o usuário usa
    emoji_style: Literal["none", "sparse", "moderate", "heavy"]

    # Comportamento
    content_prefs: ContentPreferences
    engagement: EngagementStyle

    # Contexto acumulado
    past_high_performing_posts: list[dict]  # Para few-shot learning
    recent_interview_context: str  # Resumo das últimas interações

    def to_system_prompt(self) -> str:
        """Converte para instruções de system prompt"""
        return f"""
        Você é o ghostwriter de {self.name}.

        BIO: {self.bio_summary}
        TOM: {self.tone_description()}
        AUDIÊNCIA: {self.target_audience}

        REGRAS ABSOLUTAS:
        - Nunca use: {', '.join(self.content_prefs.avoided_topics)}
        - Formato preferido: {self.content_prefs.preferred_formats[0]}
        - Emojis: {self.emoji_style}

        FRASES CARACTERÍSTICAS DO USUÁRIO:
        {chr(10).join(f'- "{p}"' for p in self.signature_phrases[:3])}
        """

    def tone_description(self) -> str:
        parts = []
        if self.tone.formal_casual > 0.7:
            parts.append("formal")
        elif self.tone.formal_casual < 0.3:
            parts.append("casual")
        # ... etc
        return ", ".join(parts)
```

---

## 8. Fluxo de Entrevista (Interview Agent)

Não faça um formulário estático. Use um agente conversacional que adapta:

```python
# agents/nodes/interview_user.py
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

INTERVIEW_SYSTEM = """Você é um estrategista de conteúdo experiente.
Seu objetivo: entender profundamente o usuário para criar posts autênticos.

PRINCÍPIOS:
1. Faça UMA pergunta de cada vez
2. Use respostas anteriores para aprofundar (ex: "Você disse X, como isso se relaciona com Y?")
3. Detecte inconsistências e esclareça
4. Termine quando tiver confiança >90% na persona

ESTRUTURA DE EXPLORAÇÃO:
- Quem é você? (identidade, background)
- Para quem você fala? (audiência)
- O que você acredita? (valores, posicionamentos)
- Como você fala? (tom, referências, humor)
- O que você evita? (tabus, concorrentes, tópicos sensíveis)
- Quando e como você engaja? (frequência, estilo de interação)
"""

async def interview_user_node(state: AgentState):
    # Carrega histórico da thread
    messages = [SystemMessage(content=INTERVIEW_SYSTEM)]
    for resp in state["user_responses"]:
        messages.extend([
            AIMessage(content=resp["question"]),
            HumanMessage(content=resp["answer"])
        ])

    # Decide: perguntar mais ou concluir?
    profile_so_far = state.get("user_profile", {})

    # Usa LLM para decidir próxima ação
    llm = await router.route(TaskType.INTERVIEW, estimate_tokens(messages))
    response = await llm.ainvoke(messages + [
        HumanMessage(content="Com base no que sabemos, devo fazer outra pergunta ou concluir a entrevista? Responda com JSON: {'action': 'ask'/'conclude', 'content': '...'}")
    ])

    decision = parse_json_response(response)

    if decision["action"] == "conclude":
        # Gera profile final
        profile = await synthesize_profile(state["user_responses"])
        return {
            "user_profile": profile,
            "interview_complete": True,
            "messages": [AIMessage(content="Perfil completo! Vamos criar conteúdo.")]
        }

    return {
        "messages": [AIMessage(content=decision["content"])],
        "interview_complete": False
    }
```

---

## 9. Roadmap de Implementação

| Fase      | Escopo                                    | Duração Est. |
| --------- | ----------------------------------------- | ------------ |
| **MVP 0** | Scraping simples + Gemini + 1 post básico | 2 semanas    |
| **MVP 1** | Entrevista interativa + perfil persistido | 2 semanas    |
| **MVP 2** | Integração X real (postar com aprovação)  | 1 semana     |
| **Beta**  | Agendamento, métricas, múltiplos posts    | 2 semanas    |
| **v1.0**  | Engajamento automático (replies), threads | 2 semanas    |
| **Scale** | Multi-LLM routing, LinkedIn, Instagram    | 1-2 meses    |

---

## 10. Perguntas para Refinar o Projeto

### Sobre o Usuário e Negócio

1. **Qual o perfil técnico do usuário final?** (Influencer individual, SMM de empresa, agência com múltiplos clientes?) Isso afeta se precisamos de multi-tenant.

2. **A aprovação humana é sempre obrigatória, ou o usuário pode delegar totalmente?** Isso muda o design do `human_review` node.

3. **Como o usuário mede sucesso?** (Seguidores, engajamento, leads, vendas?) Define o que otimizamos na geração de posts.

### Sobre Dados e Compliance

4. **O usuário pode querer que o agente responda menções automaticamente?** Isso requer processamento em tempo real de webhooks do X.

5. **Há preocupações com a marca aparecer como "bot" ou "AI-assisted"?** Podemos adicionar watermark opcional ou metadados para transparência.

6. **Como lidamos com conteúdo problemático que o usuário sugere analisar?** (Desinformação, discurso de ódio) Precisamos de filtros de safety?

### Sobre Tecnologia

7. **A latência é crítica?** (Ex: live-tweeting durante eventos) Se sim, Groq é obrigatório para certos flows.

8. **O scraping precisa ser resiliente a paywalls?** Considerar integração com services como Jina AI ou Firecrawl.

9. **Há orçamento inicial para LLMs pagos, ou 100% depende de tiers gratuitos?** Isso prioriza o esforço no router inteligente.

10. **Você considera open-source parte do projeto no futuro?** Se sim, arquitetura deve evitar hard dependencies de SaaS proprietário.

---

Quer que eu aprofunde alguma seção específica? Posso detalhar, por exemplo, o schema do banco de dados, os prompts de geração de posts, ou a estratégia de deployment.
