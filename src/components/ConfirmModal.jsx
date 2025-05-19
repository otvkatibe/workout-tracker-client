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
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s"
        }}>
            <div style={{
                background: "#23232b",
                color: "#fff",
                padding: 32,
                borderRadius: 12,
                minWidth: 320,
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                textAlign: "center",
                animation: "scaleIn 0.2s"
            }}>
                <p style={{ fontSize: 18, marginBottom: 24 }}>{message || "Tem certeza?"}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <button
                        ref={cancelBtnRef}
                        onClick={onCancel}
                        style={{
                            background: "#444",
                            color: "#fff",
                            border: "none",
                            padding: "0.7em 1.2em",
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            background: "#595cff",
                            color: "#fff",
                            border: "none",
                            padding: "0.7em 1.2em",
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}