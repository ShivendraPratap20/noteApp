import { useState } from "react";
import { toast } from "react-toastify";

const NoteCard = ({ userID, note, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const deleteNote = () => {
    setIsLoading(true);
    fetch(`/note/?userID=${userID}&noteID=${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.status === "SUCCESS") {
          toast.success(data.message);
          window.location.reload();
        } else if (data.status === "FAILED") {
          setIsError(true);
          setErrorMsg("Failed to delete notes!");
          toast.error(data.message);
          
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMsg("Failed to delete notes!");
        toast.error("Failed to delete note")
      });
  }

  return (
    <div className="note-card rounded-xl p-4 shadow-md border border-gray-200" key={id}>
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-3">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
          {note.content && (
            <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
          )}
          <div className="flex items-center mt-3 text-xs text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={deleteNote}
            className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .note-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NoteCard;