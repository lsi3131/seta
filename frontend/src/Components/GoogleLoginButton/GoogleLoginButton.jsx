import React, { useEffect } from 'react';
import { Cookies } from 'react-cookie';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/accounts/google/login/';
  };



  return (
    <button
      onClick={handleGoogleLogin}
      style={{ border: '0', backgroundColor: 'transparent', margin: '20px 0' }}
    >
      <img
        src={require('../../Assets/images/Google_Login.png')}
        alt="Google"
        style={{ cursor: 'pointer', width: '120px' }}
      />
    </button>
  );
};

export default GoogleLoginButton;
