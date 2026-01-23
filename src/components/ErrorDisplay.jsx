export default function ErrorDisplay({
    error,
    title = "Ops! Algo deu errado",
    onRetry = null,
    fullScreen = false
}) {
    if (!error) return null;

    return (
        <div className={`text-center py-8 ${fullScreen ? 'min-h-[60vh] flex items-center justify-center w-full' : ''}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">{title}</h3>
                <p className="text-text-secondary max-w-md">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 py-3 px-6 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 hover:shadow-[0_10px_40px_-10px_var(--color-primary-glow)] hover:-translate-y-1"
                    >
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
}


export function EmptyState({
    title = "Nenhum item encontrado",
    description = "Comece adicionando seu primeiro item!",
    actionLabel = null,
    onAction = null
}) {
    return (
        <div className="glass-card p-12 text-center animate-[fade-scale_0.5s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-lighter flex items-center justify-center">
                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-text-muted mb-4">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="py-3 px-6 font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 hover:shadow-[0_10px_40px_-10px_var(--color-primary-glow)] hover:-translate-y-1"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}


export function AlertMessage({
    type = "error",
    message,
    onDismiss = null
}) {
    if (!message) return null;

    const icons = {
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    const styles = {
        error: "bg-danger/10 border-danger/30 text-danger",
        warning: "bg-warning/10 border-warning/30 text-warning",
        success: "bg-success/10 border-success/30 text-success",
        info: "bg-primary/10 border-primary/30 text-primary-light"
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 border animate-[fade-in_0.3s_ease] ${styles[type]}`}>
            {icons[type]}
            <span className="flex-1">{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-1 opacity-70 hover:opacity-100 cursor-pointer bg-transparent border-none text-current"
                    aria-label="Fechar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
