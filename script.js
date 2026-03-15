document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    const state = {
        currentScreen: 'screen-login',
        history: [],
        collection: [],
        darkMode: false,
        mySubscriptionOnly: false,
        isLoggedIn: false
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
    const editOverlay = document.querySelector('.js-edit-overlay');
    const fabDelete = document.querySelector('.js-fab-delete');
    const emptyAllBtn = document.querySelector('.js-empty-all');
    const pickEmptyMsg = document.querySelector('.js-pick-empty');
    const deleteModal = document.querySelector('.js-modal');
    const modalConfirmBtn = document.querySelector('.js-modal-confirm');
    const modalCloseBtns = document.querySelectorAll('.js-modal-close');
    const loginBtn = document.querySelector('.js-login-btn');
    const goShortsBtn = document.querySelector('.js-go-shorts');
    const tabNav = document.querySelector('.tab-nav');
    
    // Collection Actions & Alert Modal
    const collectionActions = document.querySelector('.js-collection-actions');
    const removeCollectionBtn = document.querySelector('.js-remove-collection');
    const goViewBtn = document.querySelector('.js-go-view');
    // Toast UI
    const toast = document.querySelector('.js-toast');
    const toastMsg = document.querySelector('.js-toast-msg');
    const toastUndoBtn = document.querySelector('.js-toast-undo');
    let toastTimeout = null;

    // OTT Selection Modal
    const ottSelectModal = document.querySelector('.js-ott-select-modal');
    const ottSelectCloseBtns = document.querySelectorAll('.js-ott-select-close');
    const ottNavBtns = document.querySelectorAll('.js-ott-nav');


    
    // Initialize Navigation Visibility
    if (state.currentScreen === 'screen-login') {
        tabNav?.classList.add('tab-nav--hidden');
    }

    
    const ICON_PICK_FILLED = "icons/icon-pick-filled.svg";
    const ICON_PICK_OUTLINE = "icons/icon-pick-outline.svg";
    const ICON_COLLECTION_FILLED = "icons/icon-collection-filled.svg";
    const ICON_COLLECTION_OUTLINE = "icons/icon-collection-outline.svg";

    function navigateTo(screenId, saveHistory = true) {
        if (state.currentScreen === screenId) return;
        
        if (saveHistory) {
            state.history.push(state.currentScreen);
        }
        
        let newScreen = null;
        screens.forEach(s => {
            s.classList.remove('screen--active');
            if (s.id === screenId) {
                s.classList.add('screen--active');
                newScreen = s;
            }
        });
        
        // Handle Tab Nav Visibility
        const hideTabsOn = ['screen-login', 'screen-detail', 'screen-profile'];
        if (hideTabsOn.includes(screenId)) {
            tabNav?.classList.add('tab-nav--hidden');
        } else {
            tabNav?.classList.remove('tab-nav--hidden');
        }
        
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

    // Login Action
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            state.isLoggedIn = true;
            navigateTo('screen-pick');
        });
    }

    // Go to YouTube Shorts
    if (goShortsBtn) {
        goShortsBtn.addEventListener('click', () => {
            window.open('https://www.youtube.com/shorts', '_blank');
        });
    }


    // Card Edit/Delete & click -> Detail Logic
    let pressTimer = null;
    let currentDraggingCard = null;
    let startX = 0, startY = 0;
    
    function exitEditMode() {
        document.body.classList.remove('is-edit-mode');
        // Clean up classes on all cards
        cardTriggers.forEach(c => {
            c.classList.remove('is-jiggling');
            c.classList.remove('is-dragging');
            c.style.setProperty('--drag-x', `0px`);
            c.style.setProperty('--drag-y', `0px`);
        });
        fabDelete?.classList.remove('is-hovered');
    }

    function checkEmptyPick() {
        if (!pickEmptyMsg) return;
        const pickCards = document.querySelectorAll('.js-pick-list .card');
        let hasVisible = false;
        pickCards.forEach(c => {
            if(c.style.display !== 'none') hasVisible = true;
        });
        
        if(!hasVisible) {
            pickEmptyMsg.classList.remove('hidden');
            exitEditMode();
        }
    }

    // Exit edit mode if user touches outside cards or buttons (Swipe won't trigger click)
    document.addEventListener('click', (e) => {
        if (!document.body.classList.contains('is-edit-mode')) return;
        if (e.target.closest('.card') || e.target.closest('.fab-group')) return;
        exitEditMode();
    });
    function showDeleteModal() {
        deleteModal?.classList.remove('hidden');
    }

    function hideDeleteModal() {
        deleteModal?.classList.add('hidden');
    }

    if(emptyAllBtn) {
        emptyAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteModal();
        });
    }

    if(modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            const pickCards = document.querySelectorAll('.js-pick-list .card');
            pickCards.forEach(c => {
                c.style.display = 'none';
            });
            checkEmptyPick();
            hideDeleteModal();
        });
    }

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideDeleteModal();
        });
    });

    function checkFabCollision(x, y) {
        if (!fabDelete) return false;
        const rect = fabDelete.getBoundingClientRect();
        // Expand hit area slightly by 20px padding
        const hit = (
            x >= rect.left - 20 &&
            x <= rect.right + 20 &&
            y >= rect.top - 20 &&
            y <= rect.bottom + 20
        );
        if (hit) fabDelete.classList.add('is-hovered');
        else fabDelete.classList.remove('is-hovered');
        return hit;
    }

    cardTriggers.forEach(card => {
        // Pointer down -> Start hold timer
        card.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' && e.pointerType !== 'touch') return;
            
            clearTimeout(pressTimer);
            startX = e.clientX;
            startY = e.clientY;
            
            if (document.body.classList.contains('is-edit-mode')) {
                // Already in edit mode: grab the card instantly
                currentDraggingCard = card;
                card.classList.remove('is-jiggling');
                card.classList.add('is-dragging');
                card.setPointerCapture(e.pointerId);
            } else {
                // Start hold timer to enter edit mode
                pressTimer = setTimeout(() => {
                    document.body.classList.add('is-edit-mode');
                    cardTriggers.forEach(c => c.classList.add('is-jiggling'));
                    currentDraggingCard = card;
                    
                    card.classList.remove('is-jiggling');
                    card.classList.add('is-dragging');
                    
                    card.setPointerCapture(e.pointerId);
                }, 600); // 600ms hold required
            }
        });

        // Pointer move -> dragging or canceling hold
        card.addEventListener('pointermove', (e) => {
            if (currentDraggingCard === card && document.body.classList.contains('is-edit-mode')) {
                // We are actively dragging this assigned card
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                card.style.setProperty('--drag-x', `${dx}px`);
                card.style.setProperty('--drag-y', `${dy}px`);
                
                checkFabCollision(e.clientX, e.clientY);
            } else if (!document.body.classList.contains('is-edit-mode')) {
                // If moved too much before timer finishes, it's a scroll -> cancel hold
                const dx = Math.abs(e.clientX - startX);
                const dy = Math.abs(e.clientY - startY);
                if (dx > 10 || dy > 10) clearTimeout(pressTimer);
            }
        });

        // Pointer up -> Drop & Delete OR Normal Click
        card.addEventListener('pointerup', (e) => {
            clearTimeout(pressTimer); // if up before 600ms
            
            if (currentDraggingCard === card && document.body.classList.contains('is-edit-mode')) {
                // Finish Dragging
                card.releasePointerCapture(e.pointerId);
                const droppedOnFab = checkFabCollision(e.clientX, e.clientY);
                
                if (droppedOnFab) {
                    card.style.display = 'none'; // Deleted
                    // Clean up card states safely without exiting Edit Mode
                    card.style.setProperty('--drag-x', `0px`);
                    card.style.setProperty('--drag-y', `0px`);
                    card.classList.remove('is-dragging');
                    fabDelete.classList.remove('is-hovered');
                    
                    // Trigger poosh animation
                    fabDelete.classList.remove('is-popping');
                    void fabDelete.offsetWidth; // Force reflow to restart animation
                    fabDelete.classList.add('is-popping');
                    setTimeout(() => {
                        fabDelete.classList.remove('is-popping');
                        checkEmptyPick();
                    }, 400); // matches 0.4s CSS animation duration
                } else {
                    // Snap back and remain in Jiggle Edit Mode
                    card.style.setProperty('--drag-x', `0px`);
                    card.style.setProperty('--drag-y', `0px`);
                    card.classList.remove('is-dragging');
                    card.classList.add('is-jiggling'); 
                    fabDelete.classList.remove('is-hovered');
                }
                currentDraggingCard = null;
            } else {
                // It was a short click without activating edit mode or during edit mode without dragging
                if (document.body.classList.contains('is-edit-mode')) return; // In edit mode, clicking does nothing currently until overlay tap
                
                // Normal click navigation
                const id = card.getAttribute('data-id');
                const title = card.querySelector('.card__title').textContent;
                const meta = card.querySelector('.card__meta').textContent;
                const bg = card.querySelector('.card__picture').style.backgroundImage;
                // Extract raw path from url("...") to avoid quote collision in templates
                const bgRaw = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
                const poster = bgRaw ? bgRaw[1] : '';
                showDetail(id, title, meta, bg, poster);

                // The browser synthesizes a 'click' event from this pointerup.
                // Intercept it with a one-time capturing listener before it
                // reaches any button on the new screen (e.g., js-go-view, toggle).
                document.addEventListener('click', (ghostClickEvent) => {
                    ghostClickEvent.stopPropagation();
                    ghostClickEvent.preventDefault();
                }, { capture: true, once: true });
            }
        });
        
        card.addEventListener('pointercancel', () => clearTimeout(pressTimer));
    });

    function showDetail(id, title, meta, bg, poster) {
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
        
        // Store current card for collection action (poster is just the raw path, not url())
        state.activeContent = { id, title, meta, bg, poster: poster || '' };
        
        // Sync Collection Buttons
        const isInCollection = state.collection.some(c => c.id === id);
        if (isInCollection) {
            addCollectionBtn?.classList.add('hidden');
            collectionActions?.classList.remove('hidden');
        } else {
            addCollectionBtn?.classList.remove('hidden');
            collectionActions?.classList.add('hidden');
        }
        
        // Apply OTT Subscription Filter
        filterOTTList();
        
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

    function showToast(message, undoLabel, onUndo) {
        if (toastTimeout) clearTimeout(toastTimeout);
        
        toastMsg.textContent = message;
        toastUndoBtn.textContent = undoLabel;
        toast?.classList.remove('hidden');
        
        const handleUndo = () => {
            if (onUndo) onUndo();
            hideToast();
        };

        toastUndoBtn.onclick = handleUndo;

        toastTimeout = setTimeout(() => {
            hideToast();
        }, 3500);
    }

    function hideToast() {
        toast?.classList.add('hidden');
        if (toastTimeout) clearTimeout(toastTimeout);
    }

    // Collection Action
    addCollectionBtn?.addEventListener('click', () => {
        const item = state.activeContent;
        if (item && !state.collection.find(c => c.id === item.id)) {
            state.collection.push(item);
            updateCollectionUI();
            
            // Show Toast with Undo
            showToast('콜렉션에 성공적으로 담았어요!', '되돌리기', () => {
                // Undo Logic
                state.collection = state.collection.filter(c => c.id !== item.id);
                updateCollectionUI();
                
                // Toggle buttons back
                addCollectionBtn.classList.remove('hidden');
                collectionActions.classList.add('hidden');
            });
            
            // Toggle buttons
            addCollectionBtn.classList.add('hidden');
            collectionActions.classList.remove('hidden');
        }
    });

    removeCollectionBtn?.addEventListener('click', () => {
        const item = state.activeContent;
        if (item) {
            state.collection = state.collection.filter(c => c.id !== item.id);
            updateCollectionUI();
            
            // Show Toast with Undo (Re-add)
            showToast('콜렉션에서 성공적으로 뺐어요.', '다시넣기', () => {
                state.collection.push(item);
                updateCollectionUI();
                
                // Toggle buttons back
                addCollectionBtn.classList.add('hidden');
                collectionActions.classList.remove('hidden');
            });
            
            // Toggle buttons back
            addCollectionBtn.classList.remove('hidden');
            collectionActions.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.js-go-view')) {
            ottSelectModal?.classList.remove('hidden');
        }
    });

    ottSelectCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ottSelectModal?.classList.add('hidden');
        });
    });

    ottNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            if (url) window.open(url, '_blank');
            ottSelectModal?.classList.add('hidden');
        });
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
                <div class="collection-card__left">
                    <div class="collection-card__thumbnail" style="background-image: url('${item.poster}')"></div>
                    <div class="collection-card__info">
                        <div class="collection-card__title-row">
                            <div class="collection-card__title">${item.title}</div>
                            <div class="collection-card__badge">
                                <img src="icons/icon-thumb-up.svg" alt="">
                            </div>
                        </div>
                        <div class="collection-card__meta">${item.meta}</div>
                    </div>
                </div>
                <button class="button-view js-go-view">
                    <span>보러가기</span>
                    <img src="icons/icon-play.svg" alt="">
                </button>
            `;
            collectionContainer.appendChild(card);

            // Navigate to detail when clicking the card (excluding the '보러가기' button)
            card.addEventListener('click', (e) => {
                if (e.target.closest('.js-go-view')) return; // Let go-view handle itself
                showDetail(item.id, item.title, item.meta, item.bg, item.poster);

                // Intercept the synthesized click to prevent ghost interactions on the new screen
                document.addEventListener('click', (ghostClickEvent) => {
                    ghostClickEvent.stopPropagation();
                    ghostClickEvent.preventDefault();
                }, { capture: true, once: true });
            });
        });
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            state.darkMode = !state.darkMode;
            darkToggle.classList.toggle('toggle__switch--on', state.darkMode);
            document.querySelector('.app-container').classList.toggle('dark-theme', state.darkMode);
        });
    }

    function filterOTTList() {
        const ottItems = document.querySelectorAll('.ott-item');
        const subscribedOTTs = ['netflix', 'tving']; // Assumption from user request
        
        ottItems.forEach(item => {
            const ott = item.getAttribute('data-ott');
            if (state.mySubscriptionOnly) {
                if (subscribedOTTs.includes(ott)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.style.display = 'flex';
            }
        });
    }

    if (subToggle) {
        subToggle.addEventListener('click', () => {
            state.mySubscriptionOnly = !state.mySubscriptionOnly;
            subToggle.querySelector('.toggle__switch').classList.toggle('toggle__switch--on', state.mySubscriptionOnly);
            filterOTTList();
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
