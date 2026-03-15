/**
 * SceneFlow MVP Application Logic
 */

// --- Data Models (Dummy Data for MVP) ---
const MOCK_MOVIES = [
    {
        id: 'mv1',
        title: '라라랜드',
        posterPath: 'img/lalaland.jpg',
        releaseDate: '2016.12.07',
        sceneCount: 3,
        ott: [
            { id: 'n', name: 'Netflix', logo: 'https://www.netflix.com/favicon.ico', url: 'https://www.netflix.com/kr/' },
            { id: 'w', name: 'Watcha', logo: 'https://watcha.com/favicon.ico', url: 'https://watcha.com/browse/theater' }
        ],
        recommendation: "최근 저장 기반"
    },
    {
        id: 'mv2',
        title: '인셉션',
        posterPath: 'img/inception.jpeg',
        releaseDate: '2010.07.21',
        sceneCount: 2,
        ott: [
            { id: 'n', name: 'Netflix', logo: 'https://www.netflix.com/favicon.ico', url: 'https://www.netflix.com/kr/' }
        ],
        recommendation: "감정선이 강한 장면"
    },
    {
        id: 'mv3',
        title: '어바웃 타임',
        posterPath: 'img/time.jpeg',
        releaseDate: '2013.12.05',
        sceneCount: 2,
        ott: [
            { id: 'n', name: 'Netflix', logo: 'https://www.netflix.com/favicon.ico', url: 'https://www.netflix.com/kr/' },
            { id: 'w', name: 'Watcha', logo: 'https://watcha.com/favicon.ico', url: 'https://watcha.com/browse/theater' }
        ],
        recommendation: "추천"
    },
    {
        id: 'mv4',
        title: '너의 이름은.',
        posterPath: 'img/name.jpeg',
        releaseDate: '2017.01.04',
        sceneCount: 2,
        ott: [
            { id: 'n', name: 'Netflix', logo: 'https://www.netflix.com/favicon.ico', url: 'https://www.netflix.com/kr/' }
        ]
    }
];

const MOCK_SCENES = [
    {
        id: 'sc1',
        movieId: 'mv1',
        videoId: 'videoId1',
        thumbnail: 'img/movie_dance.jpg',
        title: '미아와 세바스찬의 탭댄스 장면',
        createdAt: '2024.03.11'
    },
    {
        id: 'sc2',
        movieId: 'mv2',
        videoId: 'videoId2',
        thumbnail: 'img/subway.jpg',
        title: '팽이스핀 장면 - 꿈일까 현실일까?',
        createdAt: '2024.03.12'
    },
    {
        id: 'sc3',
        movieId: 'mv1',
        videoId: 'videoId3',
        thumbnail: 'img/movie_waltz.jpg',
        title: '천문대 왈츠 씬',
        createdAt: '2024.03.10'
    },
    {
        id: 'sc4',
        movieId: 'mv2',
        videoId: 'videoId4',
        thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400',
        title: '코브와 아리아드네의 도시 설계',
        createdAt: '2024.03.13'
    },
    {
        id: 'sc5',
        movieId: 'mv1',
        videoId: 'videoId5',
        thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400',
        title: '마지막 연주 장면 (Epilogue)',
        createdAt: '2024.03.14'
    },
    {
        id: 'sc6',
        movieId: 'mv3',
        videoId: 'videoId6',
        thumbnail: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80&w=400',
        title: '빗속의 결혼식 장면 - 가장 행복한 순간',
        createdAt: '2024.03.15'
    },
    {
        id: 'sc7',
        movieId: 'mv3',
        videoId: 'videoId7',
        thumbnail: 'img/subway.jpg',
        title: '지하철 데이트 씬 - 어바웃 타임 명장면',
        createdAt: '2024.03.16'
    },
    {
        id: 'sc8',
        movieId: 'mv4',
        videoId: 'videoId8',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
        title: '혜성이 떨어지는 밤 - 운명적인 만남',
        createdAt: '2024.03.17'
    },
    {
        id: 'sc9',
        movieId: 'mv4',
        videoId: 'videoId9',
        thumbnail: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80&w=400',
        title: '황혼의 시간(카타와레도키) 재회 장면',
        createdAt: '2024.03.18'
    }
];

// --- Application State ---
const state = {
    scenes: [...MOCK_SCENES],
    movies: [...MOCK_MOVIES],
    collection: ['mv1', 'mv2'],
    currentScreen: 'home',
    currentSort: 'all', // 'all', 'newest', 'oldest'
    searchQuery: ''
};

// --- DOM Elements ---
const appContainer = document.querySelector(".app");
const navItems = document.querySelectorAll(".bottom-nav__item");
const screens = document.querySelectorAll(".screen");
const sceneFeed = document.getElementById("scene-feed");
const collectionFeed = document.getElementById("collection-feed");
const movieDetailView = document.getElementById("movie-detail-view");
const saveOverlay = document.getElementById("save-overlay");
const filterChips = document.querySelectorAll(".filters__chip");
const logo = document.querySelector(".header__title");
const darkModeToggle = document.getElementById("dark-mode-toggle-v5");
const headerProfileBtn = document.getElementById("header-profile-btn");
const headerBackBtn = document.getElementById("header-back-btn");
const toastContainer = document.getElementById("toast-container");
const youtubeModal = document.getElementById("youtube-modal");

// --- History State ---
let lastMainScreen = 'home';

// --- Functions ---

/**
 * Toast Notification Utility
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Total visibility ~2.3s (0.5s in + 1.8s hold)
    setTimeout(() => {
        toast.classList.add('toast--out');
        setTimeout(() => toast.remove(), 500);
    }, 2300);
}

/**
 * YouTube Link Confirmation Utility
 */
function showYoutubeConfirm(url) {
    youtubeModal.style.display = 'flex';
    
    const cancelBtn = youtubeModal.querySelector('.modal__btn--cancel');
    const moveBtn = youtubeModal.querySelector('.modal__btn--move');
    
    const cleanup = () => {
        youtubeModal.style.display = 'none';
        cancelBtn.removeEventListener('click', cleanup);
        moveBtn.removeEventListener('click', onMove);
    };
    
    const onMove = () => {
        window.open(url, '_blank');
        cleanup();
    };
    
    cancelBtn.addEventListener('click', cleanup);
    moveBtn.addEventListener('click', onMove);
}

/**
 * Navigation Handler [V3 Refined]
 */
function navigateTo(screenId) {
    if (['home', 'collection', 'settings'].includes(screenId)) {
        state.currentScreen = screenId;
        
        // Navigation Visibility & Active States
        const botNav = document.querySelector('.bottom-nav');
        if (screenId === 'settings') {
            botNav.style.display = 'none';
        } else {
            botNav.style.display = 'flex';
            document.querySelectorAll('.bottom-nav__button').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.getElementById(`nav-${screenId}`);
            if (activeBtn) activeBtn.classList.add('active');
            
            // Track last main screen for coming back from settings/modals
            lastMainScreen = screenId;
        }

        // Update Screens
        screens.forEach(s => s.classList.remove('screen--active'));
        document.getElementById(`screen-${screenId}`).classList.add('screen--active');
        
        // Header Logic
        const logoEl = document.getElementById("header-logo");
        const titleEl = document.getElementById("header-title");
        const backBtnEl = document.getElementById("header-back-btn");
        const bottomAreaEl = document.getElementById("header-bottom-area");

        logoEl.style.display = 'none';
        titleEl.style.display = 'none';
        backBtnEl.style.display = 'none';
        bottomAreaEl.style.display = 'none';

        if (screenId === 'home') {
            logoEl.style.display = 'flex';
            bottomAreaEl.style.display = 'block';
            renderMovieBundleFeed();
        } else if (screenId === 'collection') {
            titleEl.style.display = 'block';
            titleEl.textContent = "컬렉션";
            titleEl.classList.add('header__title--highlight');
            bottomAreaEl.style.display = 'block';
            renderCollectionFeed();
        } else if (screenId === 'settings') {
            backBtnEl.style.display = 'flex';
            titleEl.style.display = 'block';
            titleEl.textContent = "내 프로필";
            titleEl.classList.remove('header__title--highlight');
        }

        window.scrollTo(0, 0);
    }
}

/**
 * Bottom Sheet Logic [V2]
 */
function openBottomSheet(htmlContent) {
    const sheet = document.getElementById('bottom-sheet');
    const body = document.getElementById('bottom-sheet-body');
    body.innerHTML = htmlContent;
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeBottomSheet() {
    const sheet = document.getElementById('bottom-sheet');
    sheet.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handle Sorting
 */
function handleSort(sortType) {
    state.currentSort = sortType;
    
    const filterLabels = { 'all': '전체', 'newest': '최신순', 'oldest': '오래된순' };
    
    document.querySelectorAll(".filters__chip").forEach(chip => {
        chip.classList.toggle('filters__chip--active', chip.textContent.trim() === filterLabels[sortType]);
    });

    if (state.currentScreen === 'home') renderMovieBundleFeed();
    if (state.currentScreen === 'collection') renderCollectionFeed();
}

/**
 * Render Movie Bundle Feed (Home)
 */
function renderMovieBundleFeed() {
    processFeedRendering(state.movies, sceneFeed, "discovery");
}

/**
 * Render Collection Feed
 */
function renderCollectionFeed() {
    const collectedMovies = state.movies.filter(m => state.collection.includes(m.id));
    processFeedRendering(collectedMovies, collectionFeed, "collection");
}

/**
 * Common logic for rendering movie bundles
 */
function processFeedRendering(movieSource, targetElement, mode) {
    const movieBundles = movieSource.map(movie => {
        const relatedScenes = state.scenes.filter(scene => scene.movieId === movie.id);
        const sceneDates = relatedScenes.map(s => new Date(s.createdAt.replace(/\./g, '-')).getTime());
        const latestTime = sceneDates.length > 0 ? Math.max(...sceneDates) : -1;
        const oldestTime = sceneDates.length > 0 ? Math.min(...sceneDates) : -1;

        return { ...movie, scenes: relatedScenes, latestTime, oldestTime };
    }).filter(bundle => bundle.scenes.length > 0);

    if (movieBundles.length === 0) {
        targetElement.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">🎞️</div>
                <p>${mode === 'collection' ? '아직 컬렉션에 담긴 영화가 없습니다.' : '저장된 장면이 없습니다.'}</p>
            </div>`;
        return;
    }

    let displayBundles = [...movieBundles];
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        displayBundles = displayBundles.filter(bundle => {
            return bundle.title.toLowerCase().includes(query) || 
                   bundle.scenes.some(s => s.title.toLowerCase().includes(query));
        });
    }

    if (state.currentSort === 'newest') displayBundles.sort((a, b) => b.latestTime - a.latestTime);
    else if (state.currentSort === 'oldest') displayBundles.sort((a, b) => a.oldestTime - b.oldestTime);

    // Pick Mode (CardsPick)
    if (mode === 'discovery') {
        targetElement.innerHTML = displayBundles.map(bundle => `
            <article class="cards-pick" onclick="showMovieDetail('${bundle.id}')">
                <div class="cards-pick__thumbnail-wrap">
                    <img src="${bundle.posterPath}" class="cards-pick__thumbnail" alt="${bundle.title}">
                    <div class="cards-pick__overlay">
                        <div class="cards-pick__header-row">
                            <h3 class="cards-pick__title">${bundle.title}</h3>
                            ${bundle.recommendation === '추천' ? `
                                <div class="cards-pick__badge">
                                    <i class="icon-thumb-up"></i>
                                    <span>추천</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="cards-pick__meta">
                            영화 ∙ ${bundle.releaseDate.split('.')[0]}
                        </div>
                    </div>
                </div>
                <div class="cards-pick__scenes-section">
                    <div class="cards-pick__scenes-header">
                        <i class="icon-pin"></i>
                        <span class="cards-pick__scenes-count">${bundle.scenes.length} Scenes</span>
                    </div>
                    <div class="cards-pick__scenes-list" onwheel="this.scrollLeft += event.deltaY">
                        ${bundle.scenes.map(scene => `
                            <div class="cards-pick__scene-item">
                                <img src="${scene.thumbnail}" class="cards-pick__scene-img" alt="Scene preview">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    } 
    // Collection Mode (CardsCollection)
    else {
        targetElement.innerHTML = displayBundles.map(bundle => `
            <article class="cards-collection" onclick="showMovieDetail('${bundle.id}')">
                <img src="${bundle.posterPath}" class="cards-collection__thumbnail" alt="${bundle.title}">
                <div class="cards-collection__overlay">
                    <div class="cards-collection__info">
                        <div class="cards-collection__title">${bundle.title}</div>
                        <div class="cards-collection__meta">저장된 장면 ${bundle.scenes.length}개</div>
                    </div>
                    <button class="cards-collection__btn">
                        보러가기
                        <i class="icon-chevron-right"></i>
                    </button>
                </div>
            </article>
        `).join('');
    }
}

/**
 * Show Movie Detail [V2 Bottom Sheet]
 */
function showMovieDetail(movieId) {
    const movie = state.movies.find(m => m.id === movieId);
    const relatedScenes = state.scenes.filter(s => s.movieId === movieId);
    const isCollected = state.collection.includes(movieId);

    if (!movie) return;

    const detailHTML = `
        <div class="movie-detail">
            <!-- Hero Area -->
            <div class="movie-detail__hero">
                <img src="${movie.posterPath}" alt="${movie.title}" class="movie-detail__poster">
                <div class="movie-detail__hero-dim"></div>
                <div class="movie-detail__info-content">
                    <div class="movie-detail__title-wrap">
                        <h1 class="movie-detail__title">${movie.title}</h1>
                        ${movie.recommendation === '추천' ? `
                            <div class="badge-v2 pink">
                                <i class="icon-thumb-up"></i>
                                <span>추천</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="movie-detail__meta">
                        <span>영화</span>
                        <span class="dot">∙</span>
                        <span>${movie.releaseDate.split('.')[0]}</span>
                    </div>
                </div>
                <button class="movie-detail__close-btn" onclick="closeBottomSheet()">
                    <i class="icon-chevron-left"></i>
                </button>
            </div>

            <div class="movie-detail__content">
                <!-- Action Buttons -->
                <div class="movie-detail__actions">
                    <button class="btn-primary-large" onclick="toggleCollection(event, '${movie.id}')">
                        <i class="icon-plus"></i>
                        <span>${isCollected ? '콜렉션에서 제거' : '콜렉션에 넣기'}</span>
                    </button>
                </div>

                <!-- OTT List -->
                <div class="movie-detail__section">
                    <div class="section-header">
                        <h2>제공 OTT</h2>
                        <div class="toggle-sm">
                            <span>내 구독만</span>
                            <div class="toggle-track"><div class="toggle-knob"></div></div>
                        </div>
                    </div>
                    <div class="ott-list">
                        ${movie.ott.map(ott => `
                            <div class="ott-item">
                                <div class="ott-item__logo-box"><img src="${ott.logo}" alt="${ott.name}"></div>
                                <span class="ott-item__name">${ott.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Scenes Section -->
                <div class="movie-detail__section">
                    <div class="section-header">
                        <h2>픽된 장면들</h2>
                    </div>
                    <div class="scene-horizontal-list">
                        ${relatedScenes.map(scene => `
                            <div class="scene-card-v2" onclick="showYoutubeConfirm('https://youtube.com/shorts/${scene.videoId}')">
                                <img src="${scene.thumbnail}" alt="Scene preview">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    openBottomSheet(detailHTML);
}

/**
 * Toggle movie in/out of collection
 */
function toggleCollection(event, movieId) {
    if (event) event.stopPropagation();
    
    const index = state.collection.indexOf(movieId);
    if (index > -1) {
        state.collection.splice(index, 1);
        showToast("컬렉션에서 제거되었어요.");
    } else {
        state.collection.push(movieId);
        showToast("컬렉션에 저장되었어요.");
    }
    
    // Refresh Current UI
    if (state.currentScreen === 'detail') showMovieDetail(movieId);
    if (state.currentScreen === 'collection') renderCollectionFeed();
}

/**
 * Simulate Share Event
 */
function simulateSave(url) {
    saveOverlay.style.display = 'flex';
    setTimeout(() => {
        const newSceneId = 'sc' + (state.scenes.length + 1);
        const newScene = {
            id: newSceneId,
            movieId: 'mv1', 
            videoId: 'mockVideoId',
            thumbnail: 'img/movie_dance.jpg',
            title: '새로 저장된 장면 (YouTube 쇼츠 제목)',
            createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.')
        };
        state.scenes.unshift(newScene);
        saveOverlay.style.display = 'none';
        navigateTo('home');
        showToast("새로운 장면이 저장되었습니다!");
    }, 2000);
}

// --- Event Listeners ---

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.screen);
    });
});

headerProfileBtn.addEventListener('click', () => {
    navigateTo('settings');
});

headerBackBtn.addEventListener('click', () => {
    navigateTo(lastMainScreen);
});

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
        if (text === '전체') handleSort('all');
        else if (text === '최신순') handleSort('newest');
        else if (text === '오래된순') handleSort('oldest');
    });
});

document.querySelector('.search-bar__input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.currentScreen === 'home') renderMovieBundleFeed();
    if (state.currentScreen === 'collection') renderCollectionFeed();
});

document.querySelector('.search-bar__input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.toLowerCase() === 'save') {
        simulateSave('https://youtube.com/shorts/test');
        e.target.value = '';
    }
});

logo.addEventListener("click", () => navigateTo("home"));

darkModeToggle.addEventListener("click", () => {
    appContainer.classList.toggle("theme--dark");
    darkModeToggle.classList.toggle("toggle-switch--active");
    localStorage.setItem("theme", appContainer.classList.contains("theme--dark") ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        appContainer.classList.add("theme--dark");
        darkModeToggle.classList.add("toggle-switch--active");
    }
    renderMovieBundleFeed();
});


