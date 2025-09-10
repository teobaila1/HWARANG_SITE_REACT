import React from "react";

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn" onClick={onCancel}>Anulează</button>
          <button className="btn btn-danger" onClick={onConfirm}>Șterge</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;