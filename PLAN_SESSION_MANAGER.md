# Plano de Implementação - Histórico de Mensagens no Backend

## Visão Geral

Este documento detalha o plano para implementar o gerenciamento de histórico de mensagens no backend, permitindo que o agente LangChain mantenha contexto entre conversas com múltiplos usuários.

---

## Estrutura Atual

### Frontend (`apps/web/src/hooks/useAgentStream.ts`)

- Mantém estado das mensagens com `useState<Message[]>`
- Envia apenas a mensagem atual em cada requisição
- Não há persistência de session

### Backend (`apps/api/main.py`)

- Endpoint `/chat/stream_event` recebe apenas `{ message: string }`
- Não mantém histórico entre requisições
- Cada chamada é independente

---

## Fluxo Atual (Problema)

```
Frontend                          Backend
    |                                 |
    |--- POST { message: "Olá" } ----|
    |<-- resposta                    |
    |                                 |
    |--- POST { message: "Olá de novo" }|
    |<-- resposta (sem contexto!)    |
```

O agente não lembra da conversa anterior porque o histórico não é enviado.

---

## Solução Proposta

### Arquitetura com Session ID

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Verifica localStorage por session_id                     │
│ 2. Se não existe, gera UUID e salva                         │
│ 3. Envia: { message: "...", session_id: "abc-123" }        │
│ 4. Armazena mensagens no useState (para UI)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Recebe request com session_id                            │
│ 2. Se session_id é novo/vazio, cria novo                    │
│ 3. Busca histórico em memória (sessions[session_id])         │
│ 4. Adiciona nova mensagem ao histórico                       │
│ 5. Envia histórico completo para o agente LangChain          │
│ 6. Retorna session_id no stream (para primeiro acesso)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Etapas de Implementação

### Etapa 1: Backend - Session Manager

Criar um gerenciador de sessões para armazenar o histórico de mensagens por usuário.

**Arquivo:** `apps/api/main.py`

```python
from typing import Dict, List
import uuid

# Session Manager (em memória para desenvolvimento)
# Estrutura: { session_id: [BaseMessage, ...] }
chat_sessions: Dict[str, List[BaseMessage]] = {}

def get_or_create_session(session_id: str | None) -> str:
    """Gera session_id se não existir"""
    if session_id and session_id in chat_sessions:
        return session_id
    new_id = str(uuid.uuid4())
    chat_sessions[new_id] = []
    return new_id

def add_message_to_session(session_id: str, role: str, content: str):
    """Adiciona mensagem ao histórico da sessão"""
    if role == "user":
        chat_sessions[session_id].append(HumanMessage(content=content))
    else:
        chat_sessions[session_id].append(AIMessage(content=content))
```

---

### Etapa 2: Backend - Atualizar Schema e Endpoint

Modificar o endpoint para receber `session_id` e usar o histórico.

**Mudanças no ChatRequest:**

```python
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
```

**Mudanças no endpoint `/chat/stream_event`:**

```python
@app.post("/chat/stream_event")
async def chat_stream_event(request: ChatRequest):
    # Gerencia sessão
    session_id = get_or_create_session(request.session_id)
    
    # Adiciona mensagem do usuário ao histórico
    add_message_to_session(session_id, "user", request.message)
    
    # Usa o histórico completo para o agente
    messages = {"messages": chat_sessions[session_id]}
    
    async def generator():
        # Primeiro, envia o session_id se for nova sessão
        if request.session_id is None:
            yield f"data: {json.dumps({'session_id': session_id})}\n\n"
        
        # ... resto do streaming existente ...
        
        # Após completar, adiciona resposta ao histórico
        # (implementado dentro do loop de streaming)
```

---

### Etapa 3: Frontend - Gerenciar Session ID

Atualizar o hook para gerar, armazenar e enviar o `session_id`.

**Arquivo:** `apps/web/src/hooks/useAgentStream.ts`

```typescript
// Função para gerenciar session_id
const getSessionId = (): string => {
  const stored = localStorage.getItem("chat_session_id");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem("chat_session_id", newId);
  return newId;
};

// Na função stream:
const sessionId = getSessionId();

// No body da requisição:
body: JSON.stringify({ 
  message: userMessage,
  session_id: sessionId
}),
```

---

### Etapa 4: Frontend - Receber Session ID

Atualizar o parsing para capturar o `session_id` retornado pelo backend.

**No parsing das mensagens SSE:**

```typescript
// Quando receber session_id do backend
if (parsed.session_id) {
  localStorage.setItem("chat_session_id", parsed.session_id);
}
```

---

## Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `apps/api/main.py` | Adicionar session manager, atualizar ChatRequest e endpoints |
| `apps/web/src/hooks/useAgentStream.ts` | Gerenciar session_id, enviar no request |

---

## Observações Importantes

### Persistência

- Esta implementação usa memória RAM (reinicia com o servidor)
- Para produção, considere:
  - **Redis**: Armazenamento rápido em memória persistente
  - **Banco de dados** (SQLite/PostgreSQL): Para persistência total

### Segurança

- Em produção, o session_id deve ser um token JWT ou cookie seguro
- localStorage é vulnerável a XSS
- Para apps sensíveis, usar httpOnly cookies

### Limpeza de Sessões

- Adicionar TTL (time-to-live) para sessões antigas
- Implementar endpoint para limpar histórico (`DELETE /chat/session/{session_id}`)
- Monitorar uso de memória com muitas sessões ativas

---

## Fluxo Final

```
Usuário abre o chat (nova sessão)
    │
    ▼
Frontend: localStorage não tem session_id
    │
    ▼
Frontend: gera UUID, salva no localStorage
    │
    ▼
Frontend: POST /chat/stream_event { message: "...", session_id: null }
    │
    ▼
Backend: session_id é None → cria nova sessão + UUID
    │
    ▼
Backend: yield session_id no início do stream
    │
    ▼
Frontend: recebe session_id, atualiza localStorage
    │
    ▼
Usuário envia outra mensagem
    │
    ▼
Frontend: POST /chat/stream_event { message: "...", session_id: "abc-123" }
    │
    ▼
Backend: encontra sessão "abc-123", adiciona nova mensagem
    │
    ▼
Backend: envia histórico completo para LangChain agent
    │
    ▼
Agent tem contexto da conversa anterior!
```

---

## Exemplo de Requisição

### Primeira mensagem (sem session_id):

```json
// Request
{
  "message": "Olá, meu nome é João",
  "session_id": null
}

// Response (início do stream)
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Segunda mensagem (com session_id):

```json
// Request
{
  "message": "Qual é o meu nome?",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}

// Backend usa histórico:
// 1. [HumanMessage: "Olá, meu nome é João"]
// 2. [HumanMessage: "Qual é o meu nome?"]
// Agent responde: "Seu nome é João!"
```
