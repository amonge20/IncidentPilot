"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignatureBox({
    title,
    onSave
}) {

    const sigRef = useRef();
    const [saved, setSaved] = useState(false);

    function clear() {
        sigRef.current.clear();
        onSave("");
        setSaved(false);
    }

    function save() {
        if (sigRef.current.isEmpty()) {
            alert("Debe firmar antes.");
            return;
        }

        const image = sigRef.current
                .getTrimmedCanvas()
                .toDataURL("image/png");
        onSave(image);
        setSaved(true);
        alert("Firma guardada correctamente.")
    }

    return (
        <div
            style={{
                marginTop:30,
                padding:20,
                background:"#fff",
                borderRadius:10,
                border:"1px solid #ddd",
            }}
        >

            <h3 style={{
                color: "#000",
                marginBottom: 15,
            }}>{title}</h3>
            <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                    width:700,
                    height:220,
                    style:{
                        border:"2px solid #ccc",
                        borderRadius:8,
                        width:"100%",
                    }
                }}
            />

            <div
                style={{
                    display:"flex",
                    gap:15,
                    marginTop:15,
                }}
            >

                <button
                    style={{
                        background:"#1976d2",
                        color:"#fff",
                        border:"none",
                        padding:"10px 20px",
                        borderRadius:8,
                        cursor:"pointer",
                    }}
                    onClick={save}
                >
                    Guardar firma
                </button>

                <button
                    style={{
                        background:"#d32f2f",
                        color:"#fff",
                        border:"none",
                        padding:"10px 20px",
                        borderRadius:8,
                        cursor:"pointer",
                    }}
                    onClick={clear}
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}