import { useState, useRef, useEffect } from "react";
import { NoiseBackground } from "./components/noise/NoiseBackground";

import ChatInput from "./components/chatInput/ChatInput";
import ChatMessages from "./components/chatMessages/ChatMessages";

function App() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState<number>(128);

  useEffect(() => {
    if (!inputRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setInputHeight(entry.contentRect.height + 32);
    });

    observer.observe(inputRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <NoiseBackground>
      <div className="relative min-h-screen justify-items-center overflow-x-hidden p-6 text-stone-300 selection:bg-slate-700">
        <div className="overflow-y-hidden md:w-180">
          <div className="mb-4">
            <h1 className="font-bold text-2xl text-center mt-6">Postlab</h1>
            <p className="font-semibold text-center mt-2">
              Transformando ideias em conteúdo.
            </p>
            <p className="text-center mt-4">Envie um documento ou uma URL.</p>
          </div>
          <ChatMessages inputHeight={inputHeight} />
        </div>
        <div ref={inputRef} className="fixed flex flex-row bottom-4">
          <ChatInput />
        </div>
      </div>
    </NoiseBackground>
  );
}

export default App;
