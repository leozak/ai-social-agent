export type MessagePart =
  | { type: "thinking"; content: string; done: boolean }
  | { type: "response"; content: string };

export function parseThinking(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  const regex = /<think>([\s\S]*?)(<\/think>|$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Texto de resposta antes deste bloco <think>
    const before = content.slice(lastIndex, match.index).trim();
    if (before) {
      parts.push({ type: "response", content: before });
    }

    const thinkContent = match[1].trim();
    const isClosed = match[2] === "</think>";

    if (thinkContent || isClosed) {
      parts.push({ type: "thinking", content: thinkContent, done: isClosed });
    }
    lastIndex = match.index + match[0].length;
  }

  // Texto restante após o último bloco
  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    parts.push({ type: "response", content: remaining });
  }

  return parts;
}
