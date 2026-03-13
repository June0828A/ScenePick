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
const darkModeToggle = document.getElementById("toggle-dark-mode");
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
 * Navigation Handler
 */
function navigateTo(screenId) {
    if (['home', 'collection'].includes(state.currentScreen)) {
        lastMainScreen = state.currentScreen;
    }
    state.currentScreen = screenId;
    
    // Update Screens
    screens.forEach(s => s.classList.remove('screen--active'));
    document.getElementById(`screen-${screenId}`).classList.add('screen--active');
    
    // Update Header
    if (screenId === 'detail') {
        logo.classList.add('header__title--hidden');
        headerBackBtn.style.display = 'flex';
    } else {
        logo.classList.remove('header__title--hidden');
        headerBackBtn.style.display = 'none';
        
        if (screenId === 'settings') {
            logo.textContent = "내 프로필";
        } else if (screenId === 'collection') {
            logo.textContent = "컬렉션";
        } else {
            logo.textContent = "ScenePick";
        }
    }

    // Update Nav Icons
    navItems.forEach(item => {
        const icon = item.querySelector('.bottom-nav__icon');
        const isCurrent = (item.dataset.screen === screenId) || (screenId === 'detail' && item.dataset.screen === lastMainScreen);
        const isCustomIcon = icon.classList.contains('icon-nav-pick');
        
        if (isCurrent) {
            item.classList.add('bottom-nav__item--active');
            if (!isCustomIcon) {
                icon.classList.remove('material-icons-outlined');
                icon.classList.add('material-icons');
            }
        } else {
            item.classList.remove('bottom-nav__item--active');
            if (!isCustomIcon) {
                icon.classList.remove('material-icons');
                icon.classList.add('material-icons-outlined');
            }
        }
    });

    // Render Data
    if (screenId === 'home') renderMovieBundleFeed();
    if (screenId === 'collection') renderCollectionFeed();
    
    // UI Tweaks: Hide search/filters on detail/settings
    const filterSection = document.querySelector('.header__filters');
    const searchSection = document.querySelector('.header__search-bar');
    if (screenId === 'detail' || screenId === 'settings') {
        if (filterSection) filterSection.style.display = 'none';
        if (searchSection) searchSection.style.display = 'none';
    } else {
        if (filterSection) filterSection.style.display = 'flex';
        if (searchSection) searchSection.style.display = 'block';
    }
}

/**
 * Handle Sorting
 */
function handleSort(sortType) {
    state.currentSort = sortType;
    
    filterChips.forEach(chip => {
        const text = chip.textContent.trim();
        if (sortType === 'all' && text === '전체') chip.classList.add('filters__chip--active');
        else if (sortType === 'newest' && text === '최신순') chip.classList.add('filters__chip--active');
        else if (sortType === 'oldest' && text === '오래된순') chip.classList.add('filters__chip--active');
        else chip.classList.remove('filters__chip--active');
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
        displayBundles.sort((a, b) => (a.title.toLowerCase().includes(query) ? 0 : 1) - (b.title.toLowerCase().includes(query) ? 0 : 1));
    }

    if (state.currentSort === 'newest') displayBundles.sort((a, b) => b.latestTime - a.latestTime);
    else if (state.currentSort === 'oldest') displayBundles.sort((a, b) => a.oldestTime - b.oldestTime);

    // Pick Mode (Bundle Card)
    if (mode === 'discovery') {
        targetElement.innerHTML = displayBundles.map(bundle => `
            <article class="movie-bundle-card" onclick="showMovieDetail('${bundle.id}')">
                <div class="movie-bundle-card__poster-box">
                    <img src="${bundle.posterPath}" class="movie-bundle-card__poster" alt="${bundle.title}">
                </div>
                <div class="movie-bundle-card__content">
                    <div class="movie-bundle-card__header-row">
                        <h3 class="movie-bundle-card__title">${bundle.title}</h3>
                        ${bundle.recommendation === '추천' ? `<span class="movie-bundle-card__recommendation-badge"><i class="icon-thumb"></i>추천작</span>` : ''}
                    </div>
                    <div class="movie-bundle-card__scene-count-row">
                        <i class="icon-pin"></i>
                        <span class="movie-bundle-card__scene-count-text">${bundle.scenes.length}</span>
                    </div>
                    <div class="movie-bundle-card__previews">
                        ${bundle.scenes.slice(0, 3).map(scene => `
                            <div class="movie-bundle-card__preview-item">
                                <img src="${scene.thumbnail}" class="movie-bundle-card__preview-img" alt="Scene preview">
                            </div>
                        `).join('')}
                        ${bundle.scenes.length < 3 ? '<div class="movie-bundle-card__preview-item"></div>'.repeat(3 - bundle.scenes.length) : ''}
                    </div>
                </div>
            </article>
        `).join('');
    } 
    // Collection Mode (Poster Grid)
    else {
        targetElement.innerHTML = displayBundles.map(bundle => `
            <div class="card-item" onclick="showMovieDetail('${bundle.id}')">
                <img src="${bundle.posterPath}" class="card-item__img" alt="${bundle.title}">
                <div class="card-item__overlay">
                    <div class="card-item__title">${bundle.title}</div>
                    <div class="card-item__meta">저장된 장면 ${bundle.scenes.length}개</div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Show Movie Detail
 */
function showMovieDetail(movieId) {
    const movie = state.movies.find(m => m.id === movieId);
    const relatedScenes = state.scenes.filter(s => s.movieId === movieId);
    const isCollected = state.collection.includes(movieId);

    if (!movie) return;

    navigateTo('detail');
    
    movieDetailView.innerHTML = `
        <header class="movie-detail__header">
            <img src="${movie.posterPath}" class="movie-detail__poster" alt="${movie.title}">
            <div class="movie-detail__info-overlay">
                <h2 class="movie-detail__title">${movie.title}</h2>
                <div class="movie-detail__meta">개봉일: ${movie.releaseDate}</div>
                <div class="movie-detail__summary">저장된 장면 ${relatedScenes.length}개</div>
            </div>
        </header>

        <section class="movie-detail__actions">
            <button class="movie-detail__btn movie-detail__btn--primary" onclick="window.open('${movie.ott[0]?.url || '#'}', '_blank')">
                지금 시청하기
            </button>
            <button class="movie-detail__btn movie-detail__btn--secondary" onclick="toggleCollection(event, '${movie.id}')">
                ${isCollected ? '나중에 보기 제거' : '나중에 보기'}
            </button>
        </section>
        
        <section class="movie-detail__section">
            <h3 class="movie-detail__section-title">OTT 정보</h3>
            <div class="ott-list">
                ${movie.ott.map(provider => `
                    <div class="ott-badge" onclick="window.open('${provider.url}', '_blank')">
                        <img src="${provider.logo}" class="ott-badge__logo" alt="${provider.name}">
                        <div class="ott-badge__name">${provider.name}</div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="movie-detail__section">
            <h3 class="movie-detail__section-title">저장된 장면</h3>
            <div class="scene-list--horizontal">
                ${relatedScenes.map(scene => `
                    <div class="card-item" style="flex: 0 0 140px; aspect-ratio: 9/16;" onclick="showYoutubeConfirm('https://youtube.com/shorts/${scene.videoId}')">
                        <img src="${scene.thumbnail}" class="card-item__img" alt="${scene.title}">
                        <div class="card-item__overlay">
                            <div class="card-item__title">${scene.title}</div>
                            <div class="card-item__meta">${scene.createdAt}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
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
    localStorage.setItem("theme", appContainer.classList.contains("theme--dark") ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") appContainer.classList.add("theme--dark");
    renderMovieBundleFeed();
});


