import React from 'react';

/**Renders a full screen loading animation
 * 
 * @returns React Component
 */
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="mt-4">Loading...</p>
        </div>
    );
};
