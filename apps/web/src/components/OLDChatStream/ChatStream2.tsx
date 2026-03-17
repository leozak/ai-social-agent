import { useCallback, useEffect, useRef, useState } from "react";
import { LuArrowDown, LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";

import { useAgentStream } from "../../hooks/OLDuseAgentStream";

const ChatStream = () => {
  const [chatInput, setChatInput] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [inputAreaHeight, setInputAreaHeight] = useState<number>(0);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const containerChatRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef<boolean>(true);

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

  const handleScrollToBottom = () => {
    const e = containerChatRef.current;
    if (!e) return;
    e.scrollTo({
      top: e.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScroll = useCallback(() => {
    const e = containerChatRef.current;
    if (!e) return;
    const isNearBottom = e.scrollHeight - e.scrollTop - e.clientHeight < 100;
    shouldAutoScroll.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  }, []);

  useEffect(() => {
    const e = inputContainerRef.current;
    if (!e) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInputAreaHeight(entry.borderBoxSize[0].blockSize);
      }
    });
    observer.observe(e);
    return () => observer.disconnect();
  });

  useEffect(() => {
    if (!shouldAutoScroll.current) return;

    requestAnimationFrame(() => {
      const e = containerChatRef.current;
      if (e) {
        e.scrollTo({
          top: e.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  }, [messages, isLoading]);

  return (
    <div className="flex w-full h-full justify-center">
      <div className="relative flex flex-col w-full md:w-200 h-full">
        <div
          ref={containerChatRef}
          onScroll={handleScroll}
          className="relative flex flex-col flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scroll-smooth
                    [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-neutral-700
                  [&::-webkit-scrollbar-thumb]:bg-neutral-500
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
                    hover:[&::-webkit-scrollbar-thumb]:cursor-pointer"
        >
          <div>Olá, como posso ajudar?</div>

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
                  <div className="max-w-3/4">{message.content}</div>
                </div>
              )}
            </div>
          ))}

          {isLoading && <div>O Agente está pensando...</div>}
        </div>

        {showScrollButton && (
          <div
            onClick={handleScrollToBottom}
            style={{ bottom: `${inputAreaHeight + 16}px` }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2
                       bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600
                       text-white rounded-full p-2 shadow-lg
                       transition-all duration-200 cursor-pointer"
            aria-label="Ir para o final do chat"
          >
            <LuArrowDown size={20} />
          </div>
        )}

        <div
          ref={inputContainerRef}
          className="shrink-0 flex flex-row justify-center w-full p-2"
        >
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
