import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/onegrasp/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0b0e", color: "#fff", fontFamily: "system-ui" }}>
      Loading OneGrasp Bootcamp…
    </div>
  );
};

export default Index;
