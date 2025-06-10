import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Delete } from "../components/index";
import { FaPlus } from "react-icons/fa";
import { handleFailure, handleSuccess } from "../utils/toast";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState({ visible: false, id: null });
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const response = await fetch("https://apnanotes-cdn4.onrender.com", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const removeNoteHandler = (id) => {
    fetch("https://apnanotes-cdn4.onrender.com/deleteNote", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (data) => {
        await fetchNotes();
        handleSuccess(data.msg);
      })
      .catch((err) => handleFailure(err));
    setShowModal({ visible: false, id: null });

    return;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[88dvh]">
        <div className="text-white text-xl">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[88dvh]  p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          My{" "}
          <span className="bg-gradient-to-br from-purple-500 to-indigo-300 bg-clip-text text-transparent">
            Notes
          </span>
        </h1>
        <p className="text-gray-400">
          {notes.length} {notes.length === 1 ? "note" : "notes"} available
        </p>
      </header>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="text-gray-500 text-lg mb-4">
            No notes available. Create your first note!
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => navigate("/addnote")}
          >
            Add Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-white truncate">
                    {note.title}
                  </h2>
                  <span className="bg-purple-600 text-xs text-white px-2 py-1 rounded-full">
                    {note.category}
                  </span>
                </div>
              </div>
              <div className="p-4 h-48 overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
              <div className="p-3 bg-gray-750 flex justify-end space-x-4">
                <button
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  onClick={() => navigate(`/editNote/${note._id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  onClick={() => {
                    setShowModal({ visible: true, id: note._id });
                  }}
                >
                  Delete
                </button>
                <Delete
                  visible={showModal.visible}
                  onClose={() => setShowModal({ visible: false })}
                  onConfirm={() => {
                    removeNoteHandler(showModal.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {notes.length > 0 && (
        <button
          onClick={() => navigate("/addnote")}
          className="group fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white sm:px-4 sm:py-4 rounded-full transition-transform cursor-pointer px-3 py-3 z-20 "
        >
          <FaPlus className="text-sm" />

          {/* Tooltip */}
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 -translate-y-full opacity-0 sm:group-hover:bottom-7 group-hover:bottom-4 group-hover:opacity-100 transition-all duration-300 bg-purple-600 text-white px-3 py-1 rounded-md whitespace-nowrap z-30">
            Add Note
            {/* Arrow */}
            <span className="absolute left-1/2 -bottom-1 translate-x-[-50%] w-2 h-2 bg-purple-600 rotate-45"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Home;
