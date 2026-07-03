"use client";

import { useEffect, useState } from "react";

export default function Dashboard(){

    const [tickets,setTickets]=useState([]);
    const [worker,setWorker]=useState(null);

    useEffect(()=>{
        const w=JSON.parse(
            localStorage.getItem("worker")
        );

        if(!w){
            window.location.href="/worker/login";
            return;
        }
        setWorker(w);
        loadTickets(w.id);
    },[]);

    const loadTickets=async(workerId)=>{

        const res=await fetch("/api/tickets/list");

        const data=await res.json();

        const mine=data.filter(
            t=>t.assignedWorker?.id===workerId
        );
        setTickets(mine);
    }

    return(
        <div style={{padding:"30px"}}>
            <h1>
                Bienvenido {worker?.name}
            </h1>

            <h2>
                Mis incidencias
            </h2>

            {
                tickets.map(ticket=>(
                    <div
                        key={ticket.id}

                        style={{
                            background:"#fff",
                            padding:"20px",
                            borderRadius:"10px",
                            marginBottom:"20px",
                            border:"1px solid #ddd",
                        }}
                    >
                        <h3 style={{ color:"#000000" }}>{ticket.id}</h3>
                        <p style={{ color:"#000000" }}>
                            {ticket.user}
                        </p>
                        <p style={{ color:"#000000" }}>
                            {ticket.company}
                        </p>
                        <p style={{ color:"#000000" }}>
                            {ticket.priority}
                        </p>

                        <button
                            style={styles.openButton}
                            onClick={() =>
                                (window.location.href =
                                "/worker/incidencia/" + ticket.id)
                            }
                            >
                            👁 Abrir incidencia
                        </button>
                    </div>
                ))
            }
        </div>
    );
}

const styles = {
        container: {
            padding: "30px",
            background: "#f5f5f5",
            minHeight: "100vh",
        },

        card: {
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },

        title: {
            color: "#000",
            marginBottom: "10px",
        },

        text: {
            color: "#000",
            marginBottom: "8px",
        },

        openButton: {
            marginTop: "15px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontWeight: "bold",
            cursor: "pointer",
        },
    };