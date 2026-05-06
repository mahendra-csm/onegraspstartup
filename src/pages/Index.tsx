import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/onegrasp/index.html");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #ffffff 0%, #fdf1f1 100%)",
        color: "#1B212F",
        fontFamily: "Poppins, system-ui, sans-serif",
      }}
    >
      Loading OneGrasp Bootcamp...
    </div>
  );
};

export default Index;
