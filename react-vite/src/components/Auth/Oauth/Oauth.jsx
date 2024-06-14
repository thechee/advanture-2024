import './Oauth.css';

export const Oauth = () => {
  return (
    <>
      <div className='oauth-div'>
        <span className="line"></span>
        <span>or</span>
        <span className="line"></span>
      </div>
      <div className="oauth-btns">
        <a href={`${window.origin}/api/auth/oauth_login`}>
          <button className="btn" id='oauth-btn'>
            <div>
            <img
              alt="Google Logo"
              src="https://goodeggs-assets1.imgix.net/img/jujube/icons/sso-google.52837b7b5ddc7c1643ff.svg?auto=format"
            />
            </div>
            <div>
            Continue with Google
            </div>
            <div>
            </div>
          </button>
        </a>
      </div>
    </>
  );
};
