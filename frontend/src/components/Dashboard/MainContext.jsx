import React, {useState} from 'react';
import UserProfileCard from './UserProfileCard.jsx';
import NotesSection from './NotesSection.jsx';

const MainContent = ({userData}) => {

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome <span className="text-blue-600">{userData.userName}!</span>
        </h3>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <UserProfileCard
          userData={userData}
        />
        <NotesSection 
        userID={userData.userID}
        />
      </div>
    </main>
  );
};

export default MainContent;