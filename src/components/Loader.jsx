export default function Loader() {
  return (
    <div style={{
      position: "fixed",
      top: 0, 
      left: 0, 
      width: "100vw", 
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out"
    }}>
      <div className="spinner" />
      <p style={{ 
        color: "#cbd5e1", 
        marginTop: "1rem",
        fontSize: "1.1rem",
        fontWeight: 500,
        animation: "pulse 1.5s ease-in-out infinite"
      }}>Carregando...</p>
    </div>
  );
}