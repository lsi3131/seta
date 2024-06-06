import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = (provider) => {
    window.location.href = `http://127.0.0.1:8000/api/accounts/social/login/?provider=${provider}`;
  };

  const style = {
    display : ""
  }

  return (
    <div style = {{ display:'flex'}}>
        <div>
          <button
          onClick={() => handleGoogleLogin('google')}
          style={{ border: '0', backgroundColor: 'transparent', margin: '10px' }}>
          <img
            src="https://raw.githubusercontent.com/dheereshagrwal/colored-icons/1656f82b5b9a31968ab033db39768b4d0ffaf872/public/icons/google/google.svg"
            alt="Google"
            style={{ cursor: 'pointer', width: '50px' }}
          />
          </button>
        </div>
        <div>
          <button
          onClick={() => handleGoogleLogin('github')}
          style={{ border: '0', backgroundColor: 'transparent', margin: '10px' }}>
          <img src="https://raw.githubusercontent.com/dheereshagrwal/colored-icons/1656f82b5b9a31968ab033db39768b4d0ffaf872/public/icons/github/github.svg"
          alt="Google"
          style={{ cursor: 'pointer', width: '50px' }}/>
          </button>
        </div>
    </div>
  );
};

export default GoogleLoginButton;
