"use client";

import { useState } from "react";

export default function LoginWorker(){

    const [email,setEmail]=useState("");

    const login=async()=>{
        const res=await fetch("/api/workers/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email
            })
        });

        const data=await res.json();

        if(!data.success){
            alert(data.message);
            return;
        }

        localStorage.setItem(
            "worker",
            JSON.stringify(data.worker)
        );
        window.location.href="/worker/dashboard";
    }

    return(
        <div style={{
            width:"400px",
            margin:"100px auto"
        }}>

            <h1>Acceso trabajadores</h1>

            <input
                placeholder="Correo"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                style={{
                    width:"100%",
                    padding:"12px",
                    marginBottom:"20px"
                }}
            />

            <button
                onClick={login}
                style={{
                    width:"100%",
                    padding:"12px"
                }}
            >
                Entrar
            </button>
        </div>
    );
}