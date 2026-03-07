import { useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const url = "http://localhost:8000/chat/stream_event";

export function useAgentStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [completion, setCompletion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const stream = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);
      setCompletion("");

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: userMessage },
        { id: Date.now().toString(), role: "assistant", content: "" },
      ]);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) throw new Error(`Erro na requisição (${response.status}): ${response}`);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("Não foi possível ler o corpo da resposta.");

        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          const chunk = decoder.decode(value, { stream: true });

          const lines = chunk.split("\n\n");
        
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();

              if (data === "[DONE]") {
                done = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.chunk;

                if (content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + content,
                    };
                    return updated;
                  })
                }
              } catch (e) {
                console.log("Linha não processada:", line);
                console.error(e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro no streaming:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { stream, messages, isLoading };
}
