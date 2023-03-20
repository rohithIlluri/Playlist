import { google } from 'googleapis';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CLIENT_ID = '<YOUR_GOOGLE_OAUTH2_CLIENT_ID>';
const API_KEY = '<YOUR_GOOGLE_API_KEY>';
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const auth = new google.auth.OAuth2(CLIENT_ID, '', '');

const GoogleAuth = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);

  const handleAuthChange = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
  };

  const initAuth = async () => {
    try {
      await auth.setCredentials({ access_token: localStorage.getItem('access_token') });
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const url = auth.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      const { data } = await axios.post('/authurl', { url });
      window.location.href = data.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    setIsSignedIn(false);
  };

  useEffect(() => {
    initAuth();
    auth.onAuthStateChanged(handleAuthChange);
  }, []);

  return children({ isSignedIn, handleSignIn, handleSignOut });
};

export default GoogleAuth;
