export default function Loader() {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.10)",
      zIndex: 9999
    }}>
      <div>
        <div className="spinner" />
        <p style={{ color: "#fff", textAlign: "center" }}></p>
      </div>
    </div>
  );
}