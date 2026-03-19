import { useEffect, useRef, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useAgentStore } from "../../store/agent";
import { LuArrowDown } from "react-icons/lu";

import LoadingDots from "../loadingDots/LoadingDots";

const ChatMessages = ({ inputHeight }: { inputHeight: number }) => {
  const { messages, isLoading } = useAgentStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef<boolean>(true);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const threshold = 100;

    const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

    shouldAutoScroll.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ paddingBottom: inputHeight - 22 }}>
      {messages.map((message, index) => (
        <div key={index} className="markdown-body">
          {message.role === "user" ? (
            <div className="flex items-center justify-end mt-12 mb-6">
              <div className="max-w-2/3 px-6 py-2 bg-neutral-800 rounded-2xl">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-start">
              <div className="max-w-3/4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && <LoadingDots />}

      <div ref={bottomRef}></div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{ bottom: inputHeight }}
          className="fixed left-1/2 -translate-x-1/2
                    bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 
                    text-white p-2 rounded-full shadow-lg 
                    transition-all duration-300 ease-in-out
                    cursor-pointer z-50"
        >
          <LuArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatMessages;
