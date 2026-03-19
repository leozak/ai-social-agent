export function parseThinking(content: string) {
  // Bloco completo: <think>...</think>...
  const complete = content.match(/^\s*<think>([\s\S]*?)<\/think>([\s\S]*)$/);
  if (complete) {
    return {
      thinking: complete[1].trim(),
      response: complete[2].trim(),
      done: true,
    };
  }

  // Bloco parcial (ainda em streaming): <think>...
  const partial = content.match(/^\s*<think>([\s\S]*)$/);
  if (partial) {
    return { thinking: partial[1].trim(), response: "", done: false };
  }

  // Sem bloco de raciocínio
  return { thinking: null, response: content, done: true };
}
