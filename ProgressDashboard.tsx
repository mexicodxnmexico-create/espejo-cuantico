import React from 'react';

const ProgressDashboard = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-5 max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>
                <p className="text-gray-700">Here you can track your progress effectively.</p>
                {/* You can add more content/cards here for tracking metrics */}
            </div>
        </div>
    );
};

export default ProgressDashboard;