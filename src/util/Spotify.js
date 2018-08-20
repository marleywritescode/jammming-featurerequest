const clientID = 'b3a220fc01334f7fa1e37c3a2214af29';
const redirectURI = 'http://jamjam.surge.sh/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const URLToken = window.location.href.match(/access_token=([^&]*)/);
    const URLExpiry = window.location.href.match(/expires_in=([^&]*)/);

    if (URLToken && URLExpiry) {
      accessToken = URLToken[1];
      const expiresIn = Number(URLExpiry[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    console.log("Got access token")
    // GET searched track info
    if (term !== '') {
      const searchURL = `https://api.spotify.com/v1/search?type=track&q=${term}`;
      return fetch(searchURL, {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(response => {
        if (response.ok) {
          return response.json();
        }})
      .then(jsonResponse => {
        if (jsonResponse.tracks.items){
          console.log("**********************");
          return jsonResponse.tracks.items.map( track => ({
            id: track.id,
            name : track.name,
            artist: track.artists[0].name,
            album: track.album.name,
          //NEW!!
            cover: track.album.images[0].url,
          //
            uri: track.uri
          }))
        } else {
          return '';
        }
      })
    } else{
      return '';
    }
  },

  savePlaylist(playlistName, trackURIs) {
    let userID;
    let playlistID;
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    const IDEndpoint = 'https://api.spotify.com/v1/me';
    // Verify arguments have values
    if (playlistName && trackURIs) {
      // GET current user ID
      return fetch(IDEndpoint, {headers: headers})
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      // POST request to create new playlist
      .then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      // POST track URI's to new playlist
      .then(jsonResponse => {
        playlistID = jsonResponse.id
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
    }
  }
}

export default Spotify;
