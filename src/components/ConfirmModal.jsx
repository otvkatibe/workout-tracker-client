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
        <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] animate-[fade-in_0.2s_ease-out]"
            onClick={onCancel}
        >
            <div
                className="glass-card p-8 min-w-[360px] max-w-[90vw] text-center animate-[slide-up_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-lg mb-6 leading-relaxed text-text-secondary">
                    {message || "Tem certeza?"}
                </p>
                <div className="flex gap-3">
                    <button
                        ref={cancelBtnRef}
                        onClick={onCancel}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-base bg-dark-lighter/50 border border-border text-text-secondary transition-all duration-300 hover:bg-dark-lighter hover:text-text-primary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-base bg-danger text-white transition-all duration-300 hover:bg-danger-hover hover:-translate-y-0.5"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}