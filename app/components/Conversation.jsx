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
        content: `Agrega siempre al principio la frase: "<h1>Aquí tienes un resumen de tu día...</h1><br />"
        Para los correos usa etiquetas <b> y <br /> de html para formatear la información. 
        Como en el siguiente ejemplo:
        <b>{Titulo del correo}</b> <p>{cuerpo del mensaje}</p> <br />,
        y al final del resumen de cada mensaje, agrega un parrafo de máximo 5 renglones 
        con el resumen de todos los mensajes.
        Por ejemplo:
        "Hoy recibiste un mensaje de juan acerca de tu cita en el dentista, y otro de una 
        promoción de tu tarjeta de crédito, etc."
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
    <section className="w-[1000px] flex min-h-screen p-4 gap-[50px]">
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="bg-black text-white hover:bg-slate-700 transition-all duration-300 ease-in-out my-3 py-3 px-8 rounded-lg text-2xl font-serif border border-slate-500 shadow-none"
        >
          Generar resumen
        </button>
      </form>
      <div>{isLoading ? <p>Loading...</p> : <p>{responseData && parse(responseData)}</p>}</div>
    </section>
  );
}
