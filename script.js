/**
 * 1. Render songs OK
 * 2. Scroll top OK
 * 3. Play/ pause/ seek OK
 * 4. CD rotate OK
 * 5. Next/ Previous OK
 * 6. Shuffle songs OK
 * 7. Next/ Repeat when and OK
 * 8. Active song OK    
 * 9. Scroll active song into view OK
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const shuffleBtn = $('.btn-shuffle');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const PLAYER_STOGAGE_KEY = 'JP_PLAYER';

console.log(repeatBtn);

  const app = {
    isRepeat: false,
    isPlaying: false,
    isShuffle: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STOGAGE_KEY)) || {},
    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STOGAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
    {
      name: "Ai Chung Tình Được Mãi",
      singer: "Đinh Tùng Huy",
      path: "./music/aichungtinhduocmai.mp3",
      image: "./images/aichungtinhduocmai.jpg"
    },
    {
      name: "Tình Em là Đại Dương",
      singer: "Duy Mạnh",
      path: "./music/tinhemladaiduong.mp3",
      image: "./images/tinhemladaiduong.jpg"
    },
    {
      name: "Falling Down",
      singer: "Wild Cards ft. James Delaney",
      path: "./music/fallingdown.mp3",
      image:
        "./images/fallingdown.jpg"
    },
    {
      name: "Faded",
      singer: "Alan Walker",
      path: "./music/faded.mp3",
      image: "./images/faded.jpg"
    },
    {
      name: "Stay",
      singer: "The Kid LAROI, Justin Bieber",
      path: "./music/stay.mp3",
      image:
        "./images/stay.png"
    },
    {
      name: "Money",
      singer: "Lisa",
      path: "./music/money.mp3",
      image:
        "./images/money.png"
    },
    {
      name: "On The Ground",
      singer: "Rose",
      path: "./music/ontheground.mp3",
      image:
        "./images/ontheground.jpg"
    },
    {
      name: "The Nights",
      singer: "AVICII",
      path: "./music/thenights.mp3",
      image: "./images/thenights.jpg"
    },
    {
      name: "Stressed Out",
      singer: "Twenty One Pilots",
      path: "./music/stressedout.mp3",
      image:
        "./images/stressedout.jpg"
    },
    {
      name: "Radioactive",
      singer: "Imagine Dragons",
      path: "./music/radioactive.mp3",
      image:
        "./images/radioactive.jpg"
    },
    {
      name: "Thuong",
      singer: "Karik x Uyên Pím (Bệt Band)",
      path: "./music/thuong.mp3",
      image: "./images/thuong.jpg"
    },
    {
      name: "Locked Away",
      singer: "R City ft Adam Levine",
      path: "./music/lockedaway.mp3",
      image: "./images/lockedaway.jpg"
    },
    {
      name: "Yume To Hazakura",
      singer: "Wotamin",
      path: "./music/YumeToHazakuraWotamin.mp3",
      image: "./images/yumetohazakura.jpg"
    },
    {
      name: "In The End",
      singer: "Linkin Park",
      path: "./music/intheend.mp3",
      image:
        "./images/intheend.jpg"
    },],
    render: function() {
      const _this = this;
      const htmls = this.songs.map(function(song, index) {
        return `
        <div class="${index == _this.currentIndex ? 'song active': "song"}" data-index="${index}">
        <div class="thumb"  style="background-image: url('${song.image}')">
        </div>
        <div class="body">
        <h3 class="title">${song.name}</h3>
          <p class="singer">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fa-solid fa-ellipsis"></i>
          </div>
      </div>     
        `
      })
      playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex];
        }
      })
    },
    handleEvents: function() {
      const _this = this;
      // handle rotate CD and stop
      cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations: Infinity
      })

      cdThumbAnimate.pause();
      
      // handle zoom in and out Scroll bar for CD 
      document.onscroll = function() {
        const scrollTop =
        document.documentElement.scrollTop || window.scrollY;
        const newCdWidth = cdWidth -scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      }
      // Handle click Play
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause();
          
        } else {
          audio.play();
        }
      }
      // When song play
      audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add("playing")
        cdThumbAnimate.play();
      }
      // When song pause
      audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing')
        cdThumbAnimate.pause();
      }
      // Catch the currentTime of the audio
      audio.ontimeupdate = function() {
        if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = Math.floor(progressPercent);
        }
      }
      // Handle for seek
      progress.oninput = function(e) {
        const seekIime = (e.target.value * audio.duration) / 100;
        audio.currentTime = seekIime; 
      }
      // When next song
      nextBtn.onclick = function() {
        if (_this.isShuffle) {
          _this.shuffleSong();
        } else {
            _this.nextSong();
          }
        audio.play();
      }
      // when prev song
      prevBtn.onclick = function() {
        if (_this.isShuffle) {
          _this.shuffleSong();
        } else {
            _this.prevSong();
          }
        audio.play();
      }
      // when song end
      audio.onended = function() {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
        }
      }
      // Handle turn on/ off shuffle button
      shuffleBtn.onclick = function() {
        _this.isShuffle = !_this.isShuffle;
        _this.setConfig("isShuffle", _this.isShuffle);
        shuffleBtn.classList.toggle('active', _this.isShuffle);
      }
      // Handle when audio ended and turn to the next song
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle('active', _this.isRepeat);
      }
      // Handle when onclick the playlist
      playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)');

        if (songNode && !e.target.closest('.option')) {
          _this.currentIndex = Number(songNode.dataset.index); //songNode.dataset.index return string;
          _this.loadCurrentSong();
          audio.play();
        }
      }
    },

    // load the current song for dashboard
    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path;
      this.render();
      this.scrollToActiveSong();
    },
    loadConfig: function() {
      this.isShuffle = this.config.isShuffle;
      this.isRepeat = this.config.isRepeat;
      shuffleBtn.classList.toggle('active', this.isShuffle);
      repeatBtn.classList.toggle('active', this.isRepeat);
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
          $('.song.active').scrollIntoView(
            {
              behavior: 'smooth',
              block: 'center',
            }
          )
        }, 250);
      },
    nextSong: function() {
      this.currentIndex++;
      if (this.currentIndex === this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong()
    },
    prevSong: function() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong()
    },
    shuffleSong: function() {
      let randomIndex;
      do {
        randomIndex =
        Math.floor(Math.random() * this.songs.length);
      } while (randomIndex == this.currentIndex);

      this.currentIndex = randomIndex;
      this.loadCurrentSong();
    },


    start: function() {
      // Load config in localstorage and load into Ui
      this.loadConfig();
      // define poperties for object app
      this.defineProperties();

      // listen and handle DOM even 
      this.handleEvents();

      // load current song
      this.loadCurrentSong();

      // Render playlist
      this.render();
    }

  }

  app.start();