import React, { useState, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, text = "Sign in with Google" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const handleSuccess = (credentialResponse) => {
    // Prevent multiple simultaneous calls
    if (processingRef.current || isProcessing) {
      console.log('OAuth already processing, ignoring duplicate call');
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    console.log('Google OAuth success, processing token...');
    
    if (onSuccess) {
      onSuccess(credentialResponse.credential);
    }

    // Reset after a delay to prevent rapid clicking
    setTimeout(() => {
      processingRef.current = false;
      setIsProcessing(false);
    }, 2000);
  };

  const handleError = (error) => {
    console.error('Google login error:', error);
    processingRef.current = false;
    setIsProcessing(false);
    
    if (onError) {
      onError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text={isProcessing ? "Processing..." : text}
        shape="rectangular"
        disabled={isProcessing}
      />
    </div>
  );
};

export default GoogleLoginButton;