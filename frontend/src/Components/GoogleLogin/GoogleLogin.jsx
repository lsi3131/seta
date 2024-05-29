import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleSuccess = (response) => {
    axios.post('http://localhost:8000/api/v1/auth/social/login/', {
      access_token: response.access_token,
      provider: 'google'
    }).then(res => {
      console.log(res);
      // 로그인 성공 후 처리 로직
    }).catch(error => {
      console.error(error);
      // 로그인 실패 후 처리 로직
    });
  };

  const handleFailure = (error) => {
    console.error(error);
    // 로그인 실패 후 처리 로직
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
