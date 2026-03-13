import { useCallback, useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";

import { useAgentStream } from "../../hooks/useAgentStream";

const ChatStream = () => {
  const [chatInput, setChatInput] = useState("");

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const containerChatRef = useRef<HTMLDivElement>(null);
  const containerBottomRef = useRef<HTMLDivElement>(null);

  const { stream, messages, isLoading } = useAgentStream();

  const handleChatInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const elementChatInput = chatInputRef.current;
    if (!elementChatInput) return;

    elementChatInput.style.height = "auto";

    const maxHeight = 24 * 5;
    const newHeight = Math.min(elementChatInput.scrollHeight, maxHeight);

    elementChatInput.style.height = `${newHeight}px`;

    elementChatInput.style.overflowY =
      elementChatInput.scrollHeight > maxHeight ? "auto" : "hidden";

    setChatInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    stream(chatInput);
    setChatInput("");

    if (chatInputRef.current) {
      chatInputRef.current.style.height = "auto";
      chatInputRef.current.style.overflowY = "hidden";
    }
  };

  const isAtBottom = useCallback(() => {
    const e = containerChatRef.current;
    if (!e) return true;
    return e.scrollHeight - e.scrollTop - e.clientHeight < 100;
  }, []);

  useEffect(() => {
    if (isAtBottom()) {
      const e = containerChatRef.current;
      if (e) {
        e.scrollTo({
          top: e.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isAtBottom]);

  return (
    <div className="flex w-full h-full justify-center">
      <div className="relative w-full md:w-200 h-full">
        <div
          ref={containerChatRef}
          className="flex flex-col h-full overflow-y-auto p-4 space-y-3 scroll-smooth mb-80
                    [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-neutral-700
                  [&::-webkit-scrollbar-thumb]:bg-neutral-500
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
                    hover:[&::-webkit-scrollbar-thumb]:cursor-pointer"
        >
          <div className="">Olá, como posso ajudar?</div>

          {messages.map((message, index) => (
            <div key={index}>
              {message.role === "user" ? (
                <div className="flex items-center justify-end">
                  <div className="max-w-2/3 px-6 py-2 bg-neutral-800 rounded-2xl">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-start">
                  <div className="max-w-2/3">{message.content}</div>
                </div>
              )}
            </div>
          ))}

          {isLoading && <div>O Agente está pensando...</div>}

          <div ref={containerBottomRef} className="hidden"></div>
        </div>

        <div className="absolute flex flex-row justify-center w-full bottom-0">
          <div className="flex flex-col w-full px-4 py-2 bg-neutral-800 rounded-2xl shadow-md">
            <div className="h-fit">
              <textarea
                ref={chatInputRef}
                value={chatInput}
                onChange={handleChatInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Digite uma mensagem..."
                className="h-fit max-h-30 w-full resize-none leading-6 focus:outline-none
                           [&::-webkit-scrollbar]:w-2
                           [&::-webkit-scrollbar-track]:bg-neutral-700
                           [&::-webkit-scrollbar-thumb]:bg-neutral-500
                           [&::-webkit-scrollbar-thumb]:rounded-full
                           hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
                           hover:[&::-webkit-scrollbar-thumb]:cursor-pointer
                          "
                disabled={isLoading}
              ></textarea>
            </div>
            <div className="flex flex-row px-2 w-full justify-between">
              <button
                type="button"
                className="hover:text-slate-400 active:text-slate-300 hover:cursor-pointer disabled:text-stone-500 disabled:cursor-not-allowed"
                disabled={true}
              >
                <TiAttachment size={30} />
              </button>
              <button
                onClick={handleSendMessage}
                type="submit"
                disabled={isLoading}
                className="hover:text-slate-400 active:text-slate-300 hover:cursor-pointer disabled:text-stone-500 disabled:cursor-not-allowed"
              >
                <LuSend size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatStream;
