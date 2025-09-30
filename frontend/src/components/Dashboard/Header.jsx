import React from 'react';

const Header = ({userName}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img
              src="/icon.png"
              alt="Logo"
              class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">HD</h1>
          </div>
          <h2 className="text-3xl font-bold text-blue-600">Dashboard</h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src="/user.png"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-800 font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;