import React from "react";

export default function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "grid", placeItems: "center", minHeight: "40vh" }}
    >
      <div className="spinner" />
      <style>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #ccc;
          border-top-color: #b30000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
