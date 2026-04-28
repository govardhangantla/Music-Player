const trackArt = document.getElementById('track-art');
const trackName = document.getElementById('track-name');
const trackArtist = document.getElementById('track-artist');
const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressArea = document.getElementById('progress-area');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');
const playerCard = document.getElementById('player');

// Song List
const songs = [
    {
        name: "Lofi Study",
        artist: "FASSounds",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
        path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        name: "Chill Ambient",
        artist: "Coma-Media",
        image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop",
        path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        name: "Electronic Beat",
        artist: "LexinMusic",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        name: "Deep Space",
        artist: "AudioCoffee",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
        path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
];

let songIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Initialize Player
function loadSong(song) {
    trackArt.src = song.image;
    trackName.innerText = song.name;
    trackArtist.innerText = song.artist;
    audio.src = song.path;
    
    // Update active playlist item
    updatePlaylistUI();
}

function updatePlaylistUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playerCard.classList.add('playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playerCard.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    audio.pause();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex >= songs.length) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update time display
        currentTimeEl.innerText = formatTime(currentTime);
        durationEl.innerText = formatTime(duration);
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Volume Control
function handleVolume() {
    audio.volume = volumeSlider.value / 100;
}

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === songIndex ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${song.image}" class="playlist-thumb">
            <div class="playlist-info">
                <h3>${song.name}</h3>
                <p>${song.artist}</p>
            </div>
        `;
        item.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        playlistEl.appendChild(item);
    });
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
progressArea.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', handleVolume);

// Initial Setup
loadSong(songs[songIndex]);
renderPlaylist();
audio.volume = volumeSlider.value / 100;
document.title = `Stellar - ${songs[songIndex].name}`;
