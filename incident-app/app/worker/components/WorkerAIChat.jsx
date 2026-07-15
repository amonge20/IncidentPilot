"use client";

import { useState } from "react";

export default function WorkerAIChat({ ticket }) {

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {

    if (!question.trim()) return;

    setLoading(true);

    const userMessage = {
      role: "user",
      content: question,
    };

    const history = [...messages, userMessage];

    setMessages(history);

    const res = await fetch("/api/worker-chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            ticketId: ticket.id,
            message: question
        })
    });

    const data = await res.json();

    console.log(data);

    if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
    }

    setMessages([

        ...history,

        {
            role: "assistant",
            content: data.answer
        }
    ]);

    setQuestion("");

    setLoading(false);
  }

  return (
    <div
      style={{
        marginTop:40,
        background:"#fff",
        padding:20,
        borderRadius:10,
        border:"1px solid #ddd",
      }}
    >

      <h2 style={{ color:"black"}}>🤖 Asistente IA</h2>
      <div
        style={{
            maxHeight: 350,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
            background: "#ffffff",
            color: "#000000",
        }}
        >
        {
          messages.map((m,i)=>(
            <div key={i} style={{marginBottom:15}}>
              <b>
                {
                  m.role==="user"
                  ? "Trabajador"
                  : "IA"
                }
              </b>
              <div style={{marginTop:5}}>
                {m.content}
              </div>
            </div>
          ))
        }
      </div>

      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
            background: "#ffffff",
            color: "#000000",
            fontSize: "15px",
            outline: "none",
        }}
    />

      <button
        disabled={loading}
        onClick={askAI}
        style={{
            marginTop: 15,
            padding: "12px 20px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
        }}
        >
        {loading ? "Pensando..." : "🤖 Preguntar a la IA"}
        </button>
    </div>
  );
}