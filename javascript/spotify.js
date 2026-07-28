// const SPOTIFY_CLIENT_ID = "afab9c6b0e1649a0a27aa0e52d66213e";

// const REDIRECT_URI = `${window.location.origin}/callback.html`;

// const SCOPES = [
//     "user-read-currently-playing",
//     "user-read-playback-state"
// ];

// function loginSpotify() {

//     const authURL =
//         "https://accounts.spotify.com/authorize" +
//         "?response_type=token" +
//         "&client_id=" + encodeURIComponent(SPOTIFY_CLIENT_ID) +
//         "&scope=" + encodeURIComponent(SCOPES.join(" ")) +
//         "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);

//     window.location.href = authURL;
// }
// const SPOTIFY_CLIENT_ID = "afab9c6b0e1649a0a27aa0e52d66213e";
// const REDIRECT_URI = window.location.origin + window.location.pathname;

// function generateRandomString(length) {
//   let text = "";
//   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// }

// async function generateCodeChallenge(codeVerifier) {
//   // Safe check if crypto API is available
//   if (!window.crypto || !window.crypto.subtle) {
//     throw new Error("Crypto API not available. Make sure you are running via localhost or https.");
//   }
//   const encoder = new TextEncoder();
//   const data = encoder.encode(codeVerifier);
//   const digest = await window.crypto.subtle.digest('SHA-256', data);
//   return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
// }

// async function loginSpotify() {
//   try {
//     const codeVerifier = generateRandomString(64);
//     localStorage.setItem('spotify_code_verifier', codeVerifier);

//     const codeChallenge = await generateCodeChallenge(codeVerifier);
//     const scope = "user-read-currently-playing user-read-playback-state";

//     const authUrl = new URL("https://accounts.spotify.com/authorize");
//     authUrl.search = new URLSearchParams({
//       response_type: 'code',
//       client_id: SPOTIFY_CLIENT_ID,
//       scope: scope,
//       code_challenge_method: 'S256',
//       code_challenge: codeChallenge,
//       redirect_uri: REDIRECT_URI,
//     });

//     window.location.href = authUrl.toString();
//   } catch (err) {
//     console.error("Spotify Login Error:", err.message);
//     alert("Spotify login requires a secure connection (localhost or https).");
//   }
// }

// async function handleSpotifyCallback() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const code = urlParams.get('code');

//   if (code) {
//     const codeVerifier = localStorage.getItem('spotify_code_verifier');

//     const body = new URLSearchParams({
//       client_id: SPOTIFY_CLIENT_ID,
//       grant_type: 'authorization_code',
//       code: code,
//       redirect_uri: REDIRECT_URI,
//       code_verifier: codeVerifier,
//     });

//     try {
//       const response = await fetch('https://accounts.accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: body
//       });

//       const data = await response.json();
//       if (data.access_token) {
//         localStorage.setItem("spotify_access_token", data.access_token);
//         window.history.replaceState({}, document.title, window.location.pathname);
//         fetchCurrentlyPlaying(data.access_token);
//       }
//     } catch (err) {
//       console.error("Error exchanging token:", err);
//     }
//   }
// }

// async function fetchCurrentlyPlaying(token) {
//   try {
//     const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     if (response.status === 200) {
//       const data = await response.json();
//       if (data && data.item) {
//         const songTitle = data.item.name;
//         const artistName = data.item.artists.map(a => a.name).join(", ");
//         const trackLink = data.item.external_urls.spotify;
        
//         const titleEl = document.getElementById('public-song-title');
//         const artistEl = document.getElementById('public-song-artist');
//         const linkEl = document.getElementById('song-card-link');

//         if (titleEl) titleEl.textContent = songTitle;
//         if (artistEl) artistEl.textContent = artistName;
//         if (linkEl) linkEl.href = trackLink;
//       }
//     }
//   } catch (e) {
//     console.error("Could not fetch playback state", e);
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   handleSpotifyCallback();
//   const token = localStorage.getItem("spotify_access_token");
//   if (token) {
//     fetchCurrentlyPlaying(token);
//   }
// });

function getRoomSoundWhisper() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "The room wakes up with this.";
  } else if (hour >= 12 && hour < 18) {
    return "Today's thoughts have been carrying this melody.";
  } else if (hour >= 18 && hour < 22) {
    return "The evening has been sounding like this.";
  } else if (hour >= 22 || hour < 2) {
    return "The room grows quieter after dark.";
  } else {
    return "Some thoughts only arrive after midnight.";
  }
}

async function fetchSpotifyMetadata(url) {
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.json();
      const fullTitle = data.title || "Unknown Track";
      
      let title = fullTitle;
      let artist = "Sanctuary Sound";
      
      if (fullTitle.includes(" · ")) {
        const parts = fullTitle.split(" · ");
        title = parts[0];
        artist = parts[1];
      } else if (fullTitle.includes(" by ")) {
        const parts = fullTitle.split(" by ");
        title = parts[0];
        artist = parts[1];
      }

      return { title, artist, link: url };
    }
  } catch (e) {
    console.error("Could not fetch Spotify oEmbed", e);
  }
  return null;
}

// Listen to Firestore in real-time so it changes globally on every device
function loadSongData() {
  db.collection("settings").doc("room_soundtrack").onSnapshot((doc) => {
    let songData;
    if (doc.exists) {
      songData = doc.data();
    } else {
      songData = {
        title: "Saturn",
        artist: "Sleeping At Last",
        link: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6"
      };
    }

    updatePublicRoomSoundDisplay(songData);
    updateDeskRoomSoundUI(songData);
  }, (error) => {
    console.error("Error loading room sound from Firestore:", error);
  });
}

window.saveSongSetting = async function() {
  const linkInput = document.getElementById('desk-room-sound-link');
  const statusEl = document.getElementById('desk-room-sound-status');
  const rawLink = linkInput ? linkInput.value.trim() : "";

  if (!rawLink) return;

  if (statusEl) statusEl.textContent = "Updating the atmosphere...";

  const metadata = await fetchSpotifyMetadata(rawLink);
  
  const songData = metadata || {
    title: "Connected Track",
    artist: "Spotify",
    link: rawLink
  };

  try {
    // Save globally to Firebase Firestore
    await db.collection("settings").doc("room_soundtrack").set(songData);

    setTimeout(() => {
      if (statusEl) {
        statusEl.textContent = "The room sounds a little different now. ✓ Saved globally.";
        setTimeout(() => {
          statusEl.textContent = "";
        }, 3000);
      }
    }, 600);
  } catch (err) {
    console.error("Error saving room soundtrack:", err);
    if (statusEl) statusEl.textContent = "Error updating atmosphere.";
  }
};

function updatePublicRoomSoundDisplay(songData) {
  const whisperEl = document.getElementById('room-sound-whisper');
  const titleEl = document.getElementById('public-room-sound-title');
  const artistEl = document.getElementById('public-room-sound-artist');
  const linkEl = document.getElementById('public-room-sound-link');

  if (whisperEl) whisperEl.textContent = getRoomSoundWhisper();
  if (titleEl) titleEl.textContent = songData.title;
  if (artistEl) artistEl.textContent = songData.artist;
  if (linkEl) {
    linkEl.href = songData.link;
    linkEl.onclick = function(e) {
      e.preventDefault();
      linkEl.textContent = "Opening the room's soundtrack...";
      setTimeout(() => {
        window.open(songData.link, '_blank');
        setTimeout(() => {
          linkEl.textContent = "Open on Spotify ↗";
        }, 1000);
      }, 400);
    };
  }
}

function updateDeskRoomSoundUI(songData) {
  const linkInput = document.getElementById('desk-room-sound-link');
  const previewState = document.getElementById('desk-room-sound-connected-state');

  if (linkInput && document.activeElement !== linkInput) {
    linkInput.value = songData.link;
  }

  if (previewState) {
    previewState.innerHTML = `
      <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.4rem;">✓ Connected Globally</div>
      <div style="font-family: var(--font-title); font-size: 1.3rem; font-weight: 600;">♪ ${songData.title}</div>
      <div style="font-family: var(--font-quote); font-style: italic; color: var(--muted-text); margin-bottom: 0.8rem;">${songData.artist}</div>
    `;
  }
}

window.enableSongEditing = function() {
  const previewState = document.getElementById('desk-room-sound-connected-state');
  const inputsContainer = document.getElementById('desk-room-sound-inputs-container');
  if (inputsContainer) inputsContainer.style.display = 'block';
  if (previewState) previewState.style.display = 'none';
};

document.addEventListener("DOMContentLoaded", () => {
  loadSongData();
});