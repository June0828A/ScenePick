document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const state = {
        currentScreen: 'screen-pick',
        history: [],
        collection: [],
        darkMode: false,
        mySubscriptionOnly: false
    };

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const tabBtns = document.querySelectorAll('.js-tab-btn');
    const backBtns = document.querySelectorAll('.js-back-btn');
    const profileBtns = document.querySelectorAll('.js-profile-btn');
    const cardTriggers = document.querySelectorAll('.js-card-trigger');
    const addCollectionBtn = document.querySelector('.js-add-collection');
    const collectionContainer = document.querySelector('.js-collection-container');
    const emptyMsg = document.querySelector('.js-empty-msg');
    const darkToggle = document.querySelector('.js-dark-toggle');
    const subToggle = document.querySelector('.js-off-toggle');
    
    const ICON_PICK_FILLED = "icons/icon-pick-filled.svg";
    const ICON_PICK_OUTLINE = "icons/icon-pick-outline.svg";
    const ICON_COLLECTION_FILLED = "icons/icon-collection-filled.svg";
    const ICON_COLLECTION_OUTLINE = "icons/icon-collection-outline.svg";

    // --- Navigation ---
    function navigateTo(screenId, saveHistory = true) {
        if (state.currentScreen === screenId) return;
        
        if (saveHistory) {
            state.history.push(state.currentScreen);
        }
        
        screens.forEach(s => {
            s.classList.remove('screen--active');
            if (s.id === screenId) s.classList.add('screen--active');
        });
        
        state.currentScreen = screenId;
        updateTabActiveState(screenId);
    }

    function goBack() {
        if (state.history.length > 0) {
            const prev = state.history.pop();
            navigateTo(prev, false);
        }
    }

    function updateTabActiveState(screenId) {
        tabBtns.forEach(btn => {
            const target = btn.getAttribute('data-target');
            if (target === screenId || (screenId === 'screen-pick' && target === 'screen-pick') || (screenId === 'screen-collection' && target === 'screen-collection')) {
                btn.classList.add('tab-nav__item--active');
            } else {
                btn.classList.remove('tab-nav__item--active');
            }
        });

        const collectionIcon = document.getElementById('nav-icon-collection');
        const pickIconElement = document.getElementById('nav-icon-pick');

        // Swap Icons and Classes for precise layout
        if (screenId === 'screen-pick') {
            pickIconElement.src = ICON_PICK_FILLED;
            pickIconElement.className = 'layered-component-child nav-icon-pick-filled';
            
            collectionIcon.src = ICON_COLLECTION_OUTLINE;
            collectionIcon.className = 'layered-component-child nav-icon-collection-outline';
        } else if (screenId === 'screen-collection') {
            pickIconElement.src = ICON_PICK_OUTLINE;
            pickIconElement.className = 'layered-component-child nav-icon-pick-outline';
            
            collectionIcon.src = ICON_COLLECTION_FILLED;
            collectionIcon.className = 'layered-component-child nav-icon-collection-filled';
        } else {
            // Default outlines for other screens (Detail, Profile)
            pickIconElement.src = ICON_PICK_OUTLINE;
            pickIconElement.className = 'layered-component-child nav-icon-pick-outline';
            collectionIcon.src = ICON_COLLECTION_OUTLINE;
            collectionIcon.className = 'layered-component-child nav-icon-collection-outline';
        }
    }

    // --- Event Listeners ---
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // Back buttons
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            goBack();
        });
    });

    // Profile buttons
    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateTo('screen-profile');
        });
    });

    // Card click -> Detail
    cardTriggers.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const title = card.querySelector('.card__title').textContent;
            const meta = card.querySelector('.card__meta').textContent;
            const bg = card.querySelector('.card__picture').style.backgroundImage;
            
            showDetail(id, title, meta, bg);
        });
    });

    function showDetail(id, title, meta, bg) {
        const detailTitle = document.querySelector('.js-detail-title');
        const detailMeta = document.querySelector('.js-detail-meta');
        const detailHero = document.querySelector('.detail-view__hero');
        const detailScenesContainer = document.querySelector('.detail-view__scenes div');
        
        detailTitle.textContent = title;
        detailMeta.textContent = meta;
        detailHero.style.backgroundImage = bg;
        
        // Ensure detail hero covers correctly
        detailHero.style.backgroundSize = 'cover';
        detailHero.style.backgroundPosition = 'center';
        
        // Sync Scenes (Vertical list in detail using new card-scene component)
        const sourceScenes = document.querySelector(`.card[data-id="${id}"] .card__scenes-list`).querySelectorAll('.scene-preview');
        const detailScenesList = document.querySelector('.detail-view__scenes .card__scenes-list');
        if (detailScenesList && sourceScenes.length > 0) {
            detailScenesList.innerHTML = ''; // Clear old ones
            sourceScenes.forEach(s => {
                const newScene = document.createElement('div');
                newScene.className = 'card-scene';
                newScene.style.backgroundImage = s.style.backgroundImage;
                newScene.innerHTML = `
                  <div class="card-scene__content">
                    <div class="card-scene__title">${title}</div>
                    <div class="card-scene__meta">1일 전 픽됨</div>
                  </div>
                `;
                detailScenesList.appendChild(newScene);
            });
        }
        
        // Store current card for collection action
        state.activeContent = { id, title, meta, bg };
        
        navigateTo('screen-detail');
    }

    // --- Search Logic ---
    const searchInputs = document.querySelectorAll('.js-search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterCards(query);
        });
    });

    function filterCards(query) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const title = card.querySelector('.card__title').textContent.toLowerCase();
            if (title.includes(query) || query === '') {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Collection Action
    addCollectionBtn.addEventListener('click', () => {
        const item = state.activeContent;
        if (!state.collection.find(c => c.id === item.id)) {
            state.collection.push(item);
            updateCollectionUI();
            alert('컬렉션에 추가되었습니다!');
        } else {
            alert('이미 추가된 콘텐츠입니다.');
        }
    });

    function updateCollectionUI() {
        if (state.collection.length > 0) {
            emptyMsg.classList.add('hidden');
        } else {
            emptyMsg.classList.remove('hidden');
        }

        // Keep current items and add new ones (simple redraw for MVP)
        const oldItems = collectionContainer.querySelectorAll('.collection-card');
        oldItems.forEach(i => i.remove());

        state.collection.forEach(item => {
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.innerHTML = `
                <div class="collection-card__thumbnail" style="background-image: ${item.bg}"></div>
                <div class="collection-card__info">
                    <div class="collection-card__title">${item.title}</div>
                    <div class="collection-card__meta">${item.meta}</div>
                </div>
                <button class="button-view">보러가기</button>
            `;
            collectionContainer.appendChild(card);
        });
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            state.darkMode = !state.darkMode;
            darkToggle.classList.toggle('toggle__switch--on', state.darkMode);
            document.querySelector('.app-container').classList.toggle('dark-theme', state.darkMode);
        });
    }

    if (subToggle) {
        subToggle.addEventListener('click', () => {
            state.mySubscriptionOnly = !state.mySubscriptionOnly;
            subToggle.querySelector('.toggle__switch').classList.toggle('toggle__switch--on', state.mySubscriptionOnly);
        });
    }

    // --- Filter Chips ---
    const filterChips = document.querySelectorAll('.js-filter-chip');
    const mainContent = document.querySelector('.main-content');

    if (filterChips.length > 0 && mainContent) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // UI Toggle
                filterChips.forEach(c => c.classList.remove('chip--active'));
                chip.classList.add('chip--active');

                const sortType = chip.getAttribute('data-sort');
                sortCards(sortType);
            });
        });

        function sortCards(type) {
            const cards = Array.from(mainContent.querySelectorAll('.card'));
            if (type === 'all') {
                cards.sort((a, b) => parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id')));
            } else if (type === 'latest') {
                cards.sort((a, b) => parseInt(b.getAttribute('data-year')) - parseInt(a.getAttribute('data-year')));
            } else if (type === 'oldest') {
                cards.sort((a, b) => parseInt(a.getAttribute('data-year')) - parseInt(b.getAttribute('data-year')));
            }

            // Re-append in new order
            cards.forEach(card => mainContent.appendChild(card));
        }
    }
});
