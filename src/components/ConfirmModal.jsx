import { useEffect, useRef } from "react";

export default function ConfirmModal({ open, onConfirm, onCancel, message }) {
    const cancelBtnRef = useRef(null);

    useEffect(() => {
        if (open && cancelBtnRef.current) {
            cancelBtnRef.current.focus();
        }
    }, [open]);

    if (!open) return null;
    
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out"
        }} onClick={onCancel}>
            <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                color: "#f8fafc",
                padding: "2rem",
                borderRadius: "16px",
                minWidth: "360px",
                maxWidth: "90vw",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
                border: "1px solid #475569",
                textAlign: "center",
                animation: "slideInUp 0.3s ease-out"
            }} onClick={(e) => e.stopPropagation()}>
                <p style={{ 
                    fontSize: "1.1rem", 
                    marginBottom: "1.5rem",
                    lineHeight: "1.6",
                    color: "#cbd5e1"
                }}>{message || "Tem certeza?"}</p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                        ref={cancelBtnRef}
                        onClick={onCancel}
                        className="secondary"
                        style={{
                            flex: 1,
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: "1rem"
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="danger"
                        style={{
                            flex: 1,
                            padding: "0.75rem 1.5rem",
                            borderRadius: "12px",
                            fontWeight: 600,
                            fontSize: "1rem"
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}