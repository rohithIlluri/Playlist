import { useEffect, useState } from 'react';
import { google } from 'googleapis';
import GoogleAuth from './GoogleAuth';
import axios from 'axios';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  const getPlaylists = async (auth) => {
    const youtube = google.youtube({ version: 'v3', auth });
    const { data } = await youtube.playlists.list({
      part: 'snippet',
      mine: true,
      maxResults: 50,
    });
    setPlaylists(data.items);
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      google.auth
        .getClient({
          scopes: SCOPES,
        })
        .then(getPlaylists)
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <div>
      <h1>My Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlists;
