import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { LuBrain, LuChevronRight } from "react-icons/lu";

const ThinkingBlock = ({
  content,
  isComplete,
}: {
  content: string;
  isComplete: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(!isComplete);

  // Colapsa automaticamente quando o bloco <think> fecha
  useEffect(() => {
    if (isComplete) setIsOpen(false);
  }, [isComplete]);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-neutral-400 text-sm
                   cursor-pointer hover:text-neutral-300 transition-colors"
      >
        <LuChevronRight
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
        <LuBrain size={14} />
        Raciocínio
      </button>

      {isOpen && (
        <div className="border-l-2 border-neutral-700 pl-4 mt-2 text-neutral-400 text-sm markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ThinkingBlock;
