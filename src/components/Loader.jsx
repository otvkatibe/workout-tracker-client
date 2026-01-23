export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark/95 backdrop-blur-lg z-[9999] animate-[fade-in_0.2s_ease-out]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-text-secondary mt-4 text-lg font-medium animate-pulse">
        Carregando...
      </p>
    </div>
  );
}