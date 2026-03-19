import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { parseThinking } from "./parseThinking";
import ThinkingBlock from "./ThinkingBlock";

const AgentMessage = ({ content }: { content: string }) => {
  const parts = useMemo(() => parseThinking(content), [content]);

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="max-w-3/4">
        {parts.map((part, index) =>
          part.type === "thinking" ? (
            <ThinkingBlock
              key={index}
              content={part.content}
              isComplete={part.done}
            />
          ) : (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {part.content}
            </ReactMarkdown>
          ),
        )}
      </div>
    </div>
  );
};

export default AgentMessage;
