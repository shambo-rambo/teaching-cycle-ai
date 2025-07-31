import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, text = "Sign in with Google" }) => {
  const handleSuccess = (credentialResponse) => {
    if (onSuccess) {
      onSuccess(credentialResponse.credential);
    }
  };

  const handleError = (error) => {
    console.error('Google login error:', error);
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
        text={text}
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleLoginButton;