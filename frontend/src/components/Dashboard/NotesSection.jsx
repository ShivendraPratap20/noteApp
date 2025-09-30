import React, { useState, useEffect } from 'react';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNoteModal';

const NotesSection = ({ userID }) => {
  const [noteData, setNoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  function fetchNote() {
    setIsLoading(true);
    fetch(`/note/${userID}`, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.status === "SUCCESS") {
          setNoteData(data.data);
        } else if (data.status === "FAILED") {
          setIsError(true);
          setErrorMsg("Failed to load notes!");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMsg("Failed to load notes!");
      });
  }

  useEffect(() => {
    fetchNote();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchNote();
  };



  if (isLoading) return <div>Loading your note...</div>
  else if (isError) return <div>{errorMsg}</div>
  else
    return (
      <>
        <div className="flex flex-col h-full min-h-96">
          <div className="mb-6 flex-shrink-0">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">My Notes</h4>


          </div>
          <div className="notes-scroll flex-1 overflow-y-auto max-h-96 pr-2 space-y-4">
            {
              (noteData?.length == 0) ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                  <p className="text-gray-500 mb-4">Create your first note to get started!</p>
                  <button
                    onClick={handleCreateNote}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Note
                  </button>
                </div>
              ) : (
                noteData?.map((note, index) => (
                  <div
                    key={note.id}
                    className="transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <NoteCard
                      id={note._id}
                      note={note}
                      userID={userID}
                    />
                  </div>
                ))
              )
            }
          </div>
          <button
            onClick={handleCreateNote}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors shadow-lg mb-6 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Note</span>
          </button>
          <style jsx>{`
          .notes-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .notes-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .notes-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .notes-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
        </div>
        <CreateNoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userID={userID}
          setNoteData={setNoteData}
        />
      </>
    );
};


export default NotesSection;