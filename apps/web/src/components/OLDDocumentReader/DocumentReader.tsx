import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const DocumentReader = () => {
  const [message, setMessage] = useState<string>("");

  const haldleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    console.log(API_URL);
    const response = await fetch(API_URL + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    console.log(data.message);
  };

  return (
    <div className="flex flex-row justify-between">
      <label form="url" className="align-middle">
        Mensagem:
        <input
          id="url"
          name="url"
          value={message}
          onChange={haldleMessageChange}
          type="text"
          className="ml-4 rounded-md bg-taupe-800 p-2 outline-none focus:bg-taupe-700"
        />
      </label>
      <button
        onClick={handleSubmit}
        className="bg-taupe-700 py-2 px-4 rounded-md ml-4 hover:bg-taupe-600 hover:cursor-pointer active:scale-95"
      >
        Enviar
      </button>
    </div>
  );
};

export default DocumentReader;
