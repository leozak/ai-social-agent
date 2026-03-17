import { useRef, useState } from "react";

import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";

import { useAgentStore } from "../../store/agent";

const ChatInput = () => {
  const [chatInput, setChatInput] = useState<string>("");
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage } = useAgentStore();
  const { isLoading } = useAgentStore();

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
    sendMessage(chatInput);
    setChatInput("");

    if (chatInputRef.current) {
      chatInputRef.current.style.height = "auto";
      chatInputRef.current.style.overflowY = "hidden";
    }
  };

  return (
    <div className="w-10/12 rounded-xl bg-neutral-800 p-4 shadow-lg md:w-180">
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
  );
};

export default ChatInput;
