import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { parseThinking } from "./parseThinking";
import ThinkingBlock from "./ThinkingBlock";

const AgentMessage = ({ content }: { content: string }) => {
  const { thinking, response, done } = useMemo(
    () => parseThinking(content),
    [content],
  );

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="max-w-3/4">
        {thinking && <ThinkingBlock content={thinking} isComplete={done} />}
        {response && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {response}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default AgentMessage;
