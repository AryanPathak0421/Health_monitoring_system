import React from 'react';

const AlertModal = ({ isOpen, onClose, alert }) => {
    if (!isOpen || !alert) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 border-2 border-red-600 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-pulse-subtle">
                <div className="flex items-center mb-4">
                    <div className="bg-red-600 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-red-500">Critical Alert</h3>
                        <p className="text-gray-400 text-sm">Action Required Immediate</p>
                    </div>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg mb-6 border border-gray-700">
                    <p className="text-white text-lg font-medium">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-2">Detected at: {new Date().toLocaleTimeString()}</p>
                </div>
                
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
