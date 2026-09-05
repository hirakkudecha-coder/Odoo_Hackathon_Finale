import React from 'react';
import { AuthContainer } from './AuthContainer';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = (authData) => {
    if (onSuccess) {
      onSuccess(authData);
    }
    // Auto close modal after slight success delay
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthContainer
          initialMode={initialMode}
          onClose={onClose}
          onSuccess={handleSuccess}
          isModal={true}
        />
      </div>
    </div>
  );
};

export default AuthModal;
