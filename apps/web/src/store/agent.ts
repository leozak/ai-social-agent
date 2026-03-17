import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AgentStreamState {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (userMessage: string) => Promise<void>;
  clearMessages: () => void;
}

const URL = "http://localhost:8000/chat/stream_event";

function getUserId(): string {
  let id = localStorage.getItem("userId");
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString() + Math.random().toString(36).substring(2);
    localStorage.setItem("userId", id);
  }
  return id;
}

function createId(): string {
  return (
    crypto.randomUUID?.() ??
    Date.now().toString(36) + Math.random().toString(36).substring(2)
  );
}

export const useAgentStore = create<AgentStreamState>((set, get) => ({
  messages: [],

  isLoading: false,

  sendMessage: async (userMessage: string) => {
    const userMsg: Message = {
      id: createId(),
      role: "user",
      content: userMessage,
    };
    const assistantMsg: Message = {
      id: createId(),
      role: "assistant",
      content: "",
    };

    set((state) => ({
      isLoading: true,
      messages: [...state.messages, userMsg, assistantMsg],
    }));

    const assistantId = assistantMsg.id;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, user_id: getUserId() }),
      });

      if (!response.ok) {
        throw new Error(
          `Error na requisição (${response.status}): ${response}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Nao foi possivel ler o corpo da resposta.");
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.replace("data: ", "").trim();

          if (data === "[DONE]") {
            done = true;
            break;
          }

          try {
            const { chunk: content } = JSON.parse(data);

            if (content) {
              console.log(content);
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, content: msg.content + content }
                    : msg,
                ),
              }));
            }
          } catch (err) {
            console.warn("Linha não processada:", line, err);
          }
        }
      }
    } catch (err) {
      console.error("Erro no streaming:", err);

      set((state) => ({
        messages: state.messages.filter(
          (msg) => !(msg.id === assistantId && msg.content === ""),
        ),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
