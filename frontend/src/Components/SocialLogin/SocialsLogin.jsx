import React from 'react';


const SocialLoginButton = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL

  const handleGoogleLogin = (provider) => {
    window.location.href = `${BASE_URL}/api/accounts/social/login/?`;
  };

  const kakaologin = () => {
    const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
    const KAKAO_REDIRECT_URI = `${BASE_URL}/api/accounts/kakao/callback/`
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=profile_nickname`
};

  const style = {
    display : ""
  }

  return (
    <div style = {{ display:'flex', justifyContent:'center'}}>
        {/* <div> 
          <button
          onClick={() => handleGoogleLogin('google')}
          style={{ border: '0', backgroundColor: 'transparent', margin: '10px' }}>
          <img
            src="https://raw.githubusercontent.com/dheereshagrwal/colored-icons/1656f82b5b9a31968ab033db39768b4d0ffaf872/public/icons/google/google.svg"
            alt="Google"
            style={{ cursor: 'pointer', width: '50px' }}
          />
          </button>
        </div> */}
        <div>
          <button
          onClick={kakaologin}
          style={{ border: '0', backgroundColor: 'transparent', margin: '10px' }}>
          <img
            src={require("../../Assets/images/kakao_login.png")}
            alt="Google"
            style={{ cursor: 'pointer', width: '50px' }}
          />
          </button>
        </div>
        <div>
          <button
          onClick={() => handleGoogleLogin()}
          style={{ border: '0', backgroundColor: 'transparent', margin: '10px' }}>
          <img src="https://raw.githubusercontent.com/dheereshagrwal/colored-icons/1656f82b5b9a31968ab033db39768b4d0ffaf872/public/icons/github/github.svg"
          alt="Google"
          style={{ cursor: 'pointer', width: '50px' }}/>
          </button>
        </div>
    </div>
  );
};

export default SocialLoginButton;
