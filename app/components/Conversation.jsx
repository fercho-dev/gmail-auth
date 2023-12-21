"use client";

import { useEffect, useState } from "react";
import parse from 'html-react-parser';

export function Conversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessages] = useState(null);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/getMessages");
        if (!response.ok) {
          throw new Error(`Error getting messages: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };
    fetchMessages();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const input = [
      {
        role: "user",
        content: `Usa etiquetas <b> y <br /> de html para formatear la información. 
        Como en el siguiente ejemplo:
        <b>{Titulo del correo}</b> <p>{cuerpo del mensaje}</p> <br />,
        Dame un resumen de mis mensajes: ${message?.messages}`,
      },
    ];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: input }),
      });

      if (!response.ok) {
        throw new Error(`Error in response: ${response.status}`);
      }

      let textResponse = "";
      const reader = response.body.getReader();
      let { done, value } = await reader.read();
      while (!done) {
        textResponse += new TextDecoder("utf-8").decode(value);
        ({ done, value } = await reader.read());
      }

      setResponseData(textResponse);
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex min-h-screen p-4 gap-[50px]">
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded w-[200px] h-[80px]"
        >
          Dame un resumen de mi día
        </button>
      </form>
      <div>{isLoading ? <p>Loading...</p> : <p>{responseData && parse(responseData)}</p>}</div>
    </section>
  );
}
