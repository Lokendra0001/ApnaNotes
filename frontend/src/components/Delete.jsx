// Delete.jsx
import React from "react";

const Delete = ({
  visible,
  onClose,
  onConfirm,
  heading = "",
  query = "",
  btn = "",
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">
          {heading ? heading : "Confirm Delete"}
        </h2>
        <p className="mb-6">
          {query ? query : "Are you sure you want to delete this Note?"}
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
            }}
          >
            {btn ? btn : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
