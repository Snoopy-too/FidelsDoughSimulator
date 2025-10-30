import React from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 m-4 max-w-lg w-full text-gray-300 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4">Before You Begin</h2>
        <p className="mb-6 text-gray-400">
          This tool predicts doubling and tripling of Neapolitan dough based on cell reproduction, cell death over time and with your custom parameters as input. Keep in mind that for best results for your pizza, you should plan to bake your dough well before doubling in volume.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          Got It
        </button>
      </div>
    </div>
  );
};