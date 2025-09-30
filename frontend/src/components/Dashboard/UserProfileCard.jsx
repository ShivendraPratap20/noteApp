import React, { useState} from 'react';
import ProfileModal from './ProfileModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserProfileCard = ({ userData }) => {
  const [data, setData] = useState(userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setErrorMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  

  const handleLogout = () => {
    fetch("/logout", {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "SUCCESS") {
          navigate("/");
          toast.success("Welcome back! Logout successful.");
        } else if (data.status === "FAILED") {
          alert(data.message);
          setIsError(true);
          setErrorMsg(data.message);
        }
      })
      .catch((error) => {
        console.log("Error while login", error);
        toast.error("Error while logging in. Please try again.");
        setIsError(true);
        setErrorMsg("Connection error. Please try again.");
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="profile-card rounded-2xl p-6 shadow-lg border border-gray-200 w-fit h-fit max-w-full">
      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
          <img
            src={data.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">{data.userName}</h4>
          <p className="text-gray-600 mb-2 break-words">{data.userID}</p>
          <p className="text-gray-600 mb-6">{data.phoneNumber}</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-white border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
       <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={data}
        setData={setData}
        setIsModalOpen={setIsModalOpen}
      />
      <style jsx>{`
        .profile-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
      `}</style>
    </div>
  );
};

export default UserProfileCard;