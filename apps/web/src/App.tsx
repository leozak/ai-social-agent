import ChatStream from "./components/ChatStream/ChatStream";

function App() {
  return (
    <div className="flex w-screen h-screen bg-linear-to-br from-neutral-800 to-neutral-600 p-6 text-stone-300 selection:bg-slate-700">
      <ChatStream />
    </div>
  );
}

export default App;
