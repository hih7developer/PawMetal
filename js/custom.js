/**
 * SMOOTH & EYE-CATCHING HERO BANNER & NEXT SECTION ENGINE
 * Inspired by Spylt (spylt-promptly.vercel.app)
 *
 * Features:
 * 1. Kinetic Staggered Reveal on Load (Blur-to-sharp entrance)
 * 2. Animated Luxury Gold Gradient Shimmer on Highlighted Text
 * 3. Dog Image Corners Out & Follows Cursor Responsively
 * 4. Spylt-Style Next Section Cursor Reveal & Floating Wave
 * 5. Stacked Sheet Scroll Transition & Card Parallax
 * 6. Top Bar Close & Back To Top Handlers
 */

(function () {
    'use strict';

    // ========================================================
    // Force return to hero banner section on page reload / refresh
    // ========================================================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function scrollToBanner() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    // Scroll to top immediately on script execution
    scrollToBanner();

    // Reset before unload so the browser doesn't cache/save scrolled coordinates
    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    // Reset on pageshow (e.g. reload or back/forward cache restore)
    window.addEventListener('pageshow', function () {
        scrollToBanner();
    });

    // Reset again after resources and images finish loading
    window.addEventListener('load', function () {
        scrollToBanner();
        setTimeout(scrollToBanner, 40);
        setTimeout(scrollToBanner, 150);
    });

    function initAll() {
        initIntroCurtain();
        initBannerEntrance();
        initBannerMedal3D();
        initSmoothParallax();
        initSpyltNextSection();
        initChooseSection();
        initProfileSection();
        initProductDuoSection();
        initDogSectionObserver();
        initDogDesignInteractive();
        initMorePetsObserver();
        initFaqAccordion();
        initFaqObserver();
        initTopBarClose();
        initBackToTop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // ========================================================
    // 0. Full-Screen Gold Intro Curtain with 0-100% Counter
    // ========================================================
    function initIntroCurtain() {
        var curtain = document.getElementById('goldIntroCurtain');
        var counterEl = document.getElementById('curtainCounter');
        var barFill = document.getElementById('curtainBarFill');
        var mottoEl = document.getElementById('curtainMotto');
        var banner = document.querySelector('.banner');
        if (!curtain) {
            if (banner) banner.classList.add('revealed');
            return;
        }

        var isDone = false;
        var start = null;
        var duration = 1200; // 1.2s smooth counter

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function finishCurtain() {
            if (isDone) return;
            isDone = true;

            if (counterEl) counterEl.textContent = '100';
            if (barFill) barFill.style.width = '100%';
            if (mottoEl) mottoEl.textContent = 'Welcome to PawMedal';

            setTimeout(function () {
                curtain.classList.add('curtain_revealed');

                // Trigger banner entrance right as curtain slides up
                if (banner) {
                    banner.classList.add('revealed');
                }

                setTimeout(function () {
                    curtain.style.display = 'none';
                }, 1050);
            }, 140);
        }

        function step(timestamp) {
            if (isDone) return;
            if (!start) start = timestamp;
            var elapsed = timestamp - start;
            var progress = Math.min(1, elapsed / duration);
            var easedProgress = easeOutCubic(progress);
            var count = Math.floor(easedProgress * 100);

            if (counterEl) counterEl.textContent = count;
            if (barFill) barFill.style.width = count + '%';

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                finishCurtain();
            }
        }

        requestAnimationFrame(step);

        // Click curtain to fast-forward into the site immediately
        curtain.addEventListener('click', function () {
            finishCurtain();
        });
    }

    // ========================================================
    // 1. Staggered Headline Animation & Interactive Letter Hover
    // ========================================================
    function initBannerEntrance() {
        var banner = document.querySelector('.banner');
        if (!banner) return;

        var h1 = banner.querySelector('.bnr_content h1');
        if (h1 && !h1.dataset.splitDone) {
            h1.dataset.splitDone = 'true';

            var childNodes = Array.prototype.slice.call(h1.childNodes);
            var wordsArray = [];

            childNodes.forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    var words = node.textContent.trim().split(/\s+/);
                    words.forEach(function (w) {
                        if (w.length > 0) wordsArray.push({ text: w, isYellow: false });
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    var isYlw = node.classList.contains('ylwtxt');
                    var wordsInEl = node.textContent.trim().split(/\s+/);
                    wordsInEl.forEach(function (w) {
                        if (w.length > 0) wordsArray.push({ text: w, isYellow: isYlw });
                    });
                }
            });

            h1.innerHTML = '';
            var globalCharIndex = 0;

            wordsArray.forEach(function (item) {
                var wordSpan = document.createElement('span');
                wordSpan.className = 'word-wrap';

                for (var i = 0; i < item.text.length; i++) {
                    var charSpan = document.createElement('span');
                    charSpan.className = 'bnr_char' + (item.isYellow ? ' ylwtxt' : '');
                    charSpan.textContent = item.text[i];
                    charSpan.setAttribute('data-char', item.text[i]);
                    charSpan.style.transitionDelay = (globalCharIndex * 0.022 + 0.12).toFixed(3) + 's';
                    wordSpan.appendChild(charSpan);
                    globalCharIndex++;
                }

                h1.appendChild(wordSpan);
            });
        }
    }

    // ========================================================
    // 2. Banner 3D Interactive Medal (NFC Tap Wave -> Dog Reveal)
    // ========================================================
    function initBannerMedal3D() {
        var card = document.getElementById('bnr3DCard');
        var stage = document.getElementById('bnr3DStage');
        var nfcEmitter = document.getElementById('nfcRingEmitter');
        if (!card) return;

        var isFlipping = false;

        function handleClick(e) {
            // Prevent accidental triggering if user clicked a link
            if (e && e.target && (e.target.closest('a') || e.target.closest('button'))) return;

            if (isFlipping) return;

            var isFlipped = card.classList.contains('is_flipped');

            if (!isFlipped) {
                // Front medal clicked -> trigger NFC tap wave first!
                isFlipping = true;
                if (nfcEmitter) {
                    nfcEmitter.classList.remove('nfc_active');
                    void nfcEmitter.offsetWidth; // Force reflow
                    nfcEmitter.classList.add('nfc_active');
                }

                // Expanding gold NFC rings pulse outward before card flips
                setTimeout(function () {
                    card.classList.add('is_flipped');
                    if (stage) stage.classList.add('flipped_active');
                    isFlipping = false;
                }, 260);
            } else {
                // Back dog clicked -> flip back to medal
                card.classList.remove('is_flipped');
                if (stage) stage.classList.remove('flipped_active');
                if (nfcEmitter) nfcEmitter.classList.remove('nfc_active');
            }
        }

        card.addEventListener('click', handleClick);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e);
            }
        });
    }

    // ========================================================
    // 2b. Banner Background & Content Reactive Counter-Parallax
    // (Floating animation on pets has been completely removed)
    // ========================================================
    function initSmoothParallax() {
        var banner = document.querySelector('.banner');
        if (!banner) return;

        var bg = banner.querySelector('.bnr_bg');
        var content = banner.querySelector('.bnr_content');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var rect = banner.getBoundingClientRect();
        function updateRect() {
            rect = banner.getBoundingClientRect();
        }
        window.addEventListener('resize', updateRect, { passive: true });
        window.addEventListener('scroll', updateRect, { passive: true });

        // Physics State for background and content
        var state = {
            targetBgX: 0,
            targetBgY: 0,
            currBgX: 0,
            currBgY: 0,
            targetContentX: 0,
            targetContentY: 0,
            currContentX: 0,
            currContentY: 0,
            isHovered: false,
            isIdle: false,
            rafId: null
        };

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function render() {
            var ease = 0.075; // Silky inertia

            state.currBgX = lerp(state.currBgX, state.targetBgX, ease);
            state.currBgY = lerp(state.currBgY, state.targetBgY, ease);

            state.currContentX = lerp(state.currContentX, state.targetContentX, ease);
            state.currContentY = lerp(state.currContentY, state.targetContentY, ease);

            if (bg) {
                bg.style.transform = 'translate3d(' + state.currBgX.toFixed(2) + 'px, ' + state.currBgY.toFixed(2) + 'px, 0)';
            }
            if (content) {
                content.style.transform = 'translate3d(' + state.currContentX.toFixed(2) + 'px, ' + state.currContentY.toFixed(2) + 'px, 0)';
            }

            // Sleep when idle to conserve resources
            var delta = Math.abs(state.currBgX - state.targetBgX) +
                        Math.abs(state.currBgY - state.targetBgY) +
                        Math.abs(state.currContentX - state.targetContentX);

            if (!state.isHovered && delta < 0.005) {
                state.isIdle = true;
                state.rafId = null;
                return;
            }

            state.rafId = requestAnimationFrame(render);
        }

        function wakeUp() {
            if (state.isIdle || !state.rafId) {
                state.isIdle = false;
                state.rafId = requestAnimationFrame(render);
            }
        }

        wakeUp();

        // Mouse Move Listener on Banner
        banner.addEventListener('mousemove', function (e) {
            state.isHovered = true;
            wakeUp();

            var relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            var relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            // Normalized coordinates (-1 to 1) from banner center
            var normX = (relX - 0.5) * 2;
            var normY = (relY - 0.5) * 2;

            // Subtle counter-parallax on background & content only (no floating pets)
            state.targetBgX = -normX * 14;
            state.targetBgY = -normY * 9;

            state.targetContentX = -normX * 8;
            state.targetContentY = -normY * 6;
        }, { passive: true });

        // Mouse Leave - Smooth Return to Resting State
        banner.addEventListener('mouseleave', function () {
            state.isHovered = false;
            wakeUp();

            state.targetBgX = 0;
            state.targetBgY = 0;
            state.targetContentX = 0;
            state.targetContentY = 0;
        });
    }

    // ========================================================
    // 3. Features Section: 5-Step Staggered Sequence Entrance
    //    1. Circle reveal (Scale 0 -> 1)
    //    2. Icon draw (Stroke draw / golden gleam)
    //    3. Golden pulse ring (1 -> 1.5 expansion)
    //    4. Text reveal (Slide up with slight fade)
    //    5. Divider reveal (Vertical dashed lines animate top to bottom)
    //    Sequence: 01 Apple Find My -> 02 NFC & QR (+150ms) -> 03 Profile (+150ms) -> 04 Waterproof (+150ms)
    // ========================================================
    function initSpyltNextSection() {
        var features = document.querySelector('.features');
        var banner = document.querySelector('.banner');
        if (!features) return;

        // IntersectionObserver: Triggers only when features section scrolls into view
        // Completely self-contained without triggering or moving other sections
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        features.classList.add('in-view');
                        // After the full staggered sequence finishes (~1.5s), mark anim-done for smooth hover
                        setTimeout(function () {
                            features.classList.add('anim-done');
                        }, 1600);
                        observer.unobserve(features);
                    }
                });
            }, { threshold: 0.22, rootMargin: '0px 0px -40px 0px' });

            observer.observe(features);
        } else {
            features.classList.add('in-view', 'anim-done');
        }

        // Clean Banner Parallax (Self-contained, does not affect other sections)
        if (banner) {
            window.addEventListener('scroll', function () {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop;
                var bannerH = banner.offsetHeight;

                if (scrollY <= bannerH) {
                    var progress = scrollY / bannerH;
                    var bannerScale = Math.max(0.95, 1 - progress * 0.05);
                    var bannerShift = progress * 25;
                    banner.style.transform = 'scale(' + bannerScale.toFixed(3) + ') translateY(' + bannerShift.toFixed(1) + 'px)';
                    banner.style.borderRadius = (progress * 24).toFixed(1) + 'px';
                }
            }, { passive: true });
        }
    }

    // ========================================================
    // 4. Choose Section: Scroll Entrance from the Middle (No Floating Effect)
    // ========================================================
    // 4. Interactive 3D Product Showcase (Tag, Finder, Bundle)
    //    - Smooth Y-Axis Spin Carousel Transitions
    //    - Product-Specific Dynamic Background Glows
    //    - Giant Outlined Typography & Rotating Gold Orbit Rings
    //    - NFC Scan Pulses & Cursor-Responsive 3D Tilt Rig
    //    - Left-Side Picker with Animated Gold Progress Lines & Auto-Cycle
    //    - Right-Side Info Panel with Text Reveals & Animated Price Counter
    //    - Touch Swipe, Mouse Drag, Keyboard Arrows & Accessibility
    // ========================================================
    function initChooseSection() {
        var chooseSection = document.getElementById('chooseSection');
        if (!chooseSection) return;

        var stage = document.getElementById('showcaseStage');
        var tiltRig = document.getElementById('stageTiltRig');
        var nfcEmitter = document.getElementById('stageNfcEmitter');
        var cycleStatus = document.getElementById('pickerCycleStatus');

        var products = chooseSection.querySelectorAll('.showcase_product');
        var giantTypes = chooseSection.querySelectorAll('.stage_giant_type');
        var pickerItems = chooseSection.querySelectorAll('.picker_item');
        var dots = chooseSection.querySelectorAll('.stage_dot');
        var infoCards = chooseSection.querySelectorAll('.info_card');
        var prevBtn = document.getElementById('stagePrevBtn');
        var nextBtn = document.getElementById('stageNextBtn');

        if (!products.length || !pickerItems.length) return;

        var currentIndex = 0;
        var totalProducts = products.length;
        var prices = [49.90, 79.90, 99.90];
        var cycleDuration = 5500; // 5.5s per product
        var cycleStartTime = Date.now();
        var isPaused = false;
        var isSwitching = false;
        var currentPriceVal = prices[0];
        var priceRaf = null;

        // Animate Number Count Up for Price
        function animatePrice(targetVal, priceEl) {
            if (!priceEl) return;
            if (priceRaf) cancelAnimationFrame(priceRaf);

            var startVal = currentPriceVal;
            var startTime = performance.now();
            var duration = 500; // 500ms smooth count

            function update(now) {
                var elapsed = now - startTime;
                var progress = Math.min(1, elapsed / duration);
                var ease = 1 - (1 - progress) * (1 - progress);
                var val = startVal + (targetVal - startVal) * ease;
                priceEl.textContent = val.toFixed(2);

                if (progress < 1) {
                    priceRaf = requestAnimationFrame(update);
                } else {
                    priceEl.textContent = targetVal.toFixed(2);
                    currentPriceVal = targetVal;
                    priceRaf = null;
                }
            }
            priceRaf = requestAnimationFrame(update);
        }

        // Switch to Product
        function switchProduct(newIndex, direction) {
            if (newIndex === currentIndex && !isSwitching) return;
            if (isSwitching) return;
            isSwitching = true;

            if (direction === undefined) {
                direction = newIndex > currentIndex ? 1 : -1;
            }

            var oldProduct = products[currentIndex];
            var newProduct = products[newIndex];

            // 1. Smooth Y-Axis Spin
            if (oldProduct) {
                oldProduct.classList.remove('active');
                if (direction > 0) {
                    oldProduct.classList.add('spin_out_left');
                    oldProduct.classList.remove('spin_out_right');
                } else {
                    oldProduct.classList.add('spin_out_right');
                    oldProduct.classList.remove('spin_out_left');
                }
            }

            if (newProduct) {
                newProduct.classList.remove('spin_out_left', 'spin_out_right');
                newProduct.classList.add('active');
            }

            // 2. Giant Outlined Typography
            giantTypes.forEach(function (gt, idx) {
                gt.classList.toggle('active', idx === newIndex);
            });

            // 3. Dynamic Background Theme
            chooseSection.setAttribute('data-theme', newIndex);

            // 4. Left Product Picker Tabs
            pickerItems.forEach(function (item, idx) {
                var isActive = idx === newIndex;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', isActive ? 'true' : 'false');
                item.setAttribute('tabindex', isActive ? '0' : '-1');

                var fill = item.querySelector('.picker_progress_fill');
                if (fill && !isActive) {
                    fill.style.width = '0%';
                }
            });

            // 5. Dots Navigation
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('active', idx === newIndex);
            });

            // 6. Right Information Panel & Animated Price Count
            infoCards.forEach(function (card, idx) {
                card.classList.toggle('active', idx === newIndex);
            });

            var newPriceEl = document.getElementById('priceDisplay' + newIndex);
            animatePrice(prices[newIndex], newPriceEl);

            // 7. Trigger NFC Scan Wave Pulse
            if (nfcEmitter) {
                nfcEmitter.classList.remove('pulse_active');
                void nfcEmitter.offsetWidth; // Force reflow
                nfcEmitter.classList.add('pulse_active');
            }

            currentIndex = newIndex;
            cycleStartTime = Date.now();

            setTimeout(function () {
                isSwitching = false;
            }, 850);
        }

        // Auto-Cycling Animation Loop with Progress Line Fill
        function autoCycleLoop() {
            if (!isPaused) {
                var elapsed = Date.now() - cycleStartTime;
                var progress = Math.min(1, elapsed / cycleDuration);

                var activeFill = document.getElementById('pickerProgress' + currentIndex);
                if (activeFill) {
                    activeFill.style.width = (progress * 100) + '%';
                }

                if (progress >= 1) {
                    var nextIndex = (currentIndex + 1) % totalProducts;
                    switchProduct(nextIndex, 1);
                }
            }
            requestAnimationFrame(autoCycleLoop);
        }
        requestAnimationFrame(autoCycleLoop);

        // Hover to Pause Auto-Cycling
        var stageGrid = document.getElementById('showcaseStageGrid');
        var pauseProgress = 0;

        if (stageGrid) {
            stageGrid.addEventListener('mouseenter', function () {
                isPaused = true;
                pauseProgress = Math.min(1, (Date.now() - cycleStartTime) / cycleDuration);
                if (cycleStatus) {
                    cycleStatus.classList.add('paused');
                    var statusText = cycleStatus.querySelector('.cycle_status_text');
                    if (statusText) statusText.textContent = 'Paused (Leave to resume)';
                }
            });

            stageGrid.addEventListener('mouseleave', function () {
                isPaused = false;
                cycleStartTime = Date.now() - (pauseProgress * cycleDuration);
                if (cycleStatus) {
                    cycleStatus.classList.remove('paused');
                    var statusText = cycleStatus.querySelector('.cycle_status_text');
                    if (statusText) statusText.textContent = 'Auto-cycling (Hover stage to pause)';
                }
            });
        }

        // Left Column Picker Click
        pickerItems.forEach(function (item) {
            item.addEventListener('click', function () {
                var idx = parseInt(item.getAttribute('data-product'), 10);
                switchProduct(idx);
            });
        });

        // Chevron Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                var idx = (currentIndex - 1 + totalProducts) % totalProducts;
                switchProduct(idx, -1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                var idx = (currentIndex + 1) % totalProducts;
                switchProduct(idx, 1);
            });
        }

        // Dots Click
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(dot.getAttribute('data-dot'), 10);
                switchProduct(idx);
            });
        });

        // Keyboard Arrow Navigation
        window.addEventListener('keydown', function (e) {
            var rect = chooseSection.getBoundingClientRect();
            // Only respond when chooseSection is in view
            if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= window.innerHeight * 0.2) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    switchProduct((currentIndex + 1) % totalProducts, 1);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    switchProduct((currentIndex - 1 + totalProducts) % totalProducts, -1);
                }
            }
        });

        // Touch Swipe & Mouse Drag on Stage
        if (stage) {
            var startX = 0;
            var isDragging = false;

            // Touch
            stage.addEventListener('touchstart', function (e) {
                if (e.touches && e.touches.length) {
                    startX = e.touches[0].clientX;
                }
            }, { passive: true });

            stage.addEventListener('touchend', function (e) {
                if (e.changedTouches && e.changedTouches.length) {
                    var endX = e.changedTouches[0].clientX;
                    var diffX = endX - startX;
                    if (Math.abs(diffX) > 40) {
                        if (diffX > 0) {
                            switchProduct((currentIndex - 1 + totalProducts) % totalProducts, -1);
                        } else {
                            switchProduct((currentIndex + 1) % totalProducts, 1);
                        }
                    }
                }
            }, { passive: true });

            // Mouse Drag
            stage.addEventListener('mousedown', function (e) {
                startX = e.clientX;
                isDragging = true;
            });

            window.addEventListener('mouseup', function (e) {
                if (!isDragging) return;
                isDragging = false;
                var diffX = e.clientX - startX;
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        switchProduct((currentIndex - 1 + totalProducts) % totalProducts, -1);
                    } else {
                        switchProduct((currentIndex + 1) % totalProducts, 1);
                    }
                }
            });
        }

        // Cursor-Responsive 3D Tilt Rig with Inertia
        if (tiltRig && stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var tiltState = {
                targetX: 0,
                targetY: 0,
                currX: 0,
                currY: 0,
                isHovered: false
            };

            stage.addEventListener('mousemove', function (e) {
                tiltState.isHovered = true;
                var rect = stage.getBoundingClientRect();
                var relX = (e.clientX - rect.left) / rect.width;
                var relY = (e.clientY - rect.top) / rect.height;
                var normX = (relX - 0.5) * 2;
                var normY = (relY - 0.5) * 2;

                tiltState.targetX = -normY * 16; // Pitch (deg)
                tiltState.targetY = normX * 20;  // Yaw (deg)
            });

            stage.addEventListener('mouseleave', function () {
                tiltState.isHovered = false;
                tiltState.targetX = 0;
                tiltState.targetY = 0;
            });

            function renderTilt() {
                var ease = 0.08;
                tiltState.currX += (tiltState.targetX - tiltState.currX) * ease;
                tiltState.currY += (tiltState.targetY - tiltState.currY) * ease;

                tiltRig.style.transform = 'perspective(1200px) rotateX(' + tiltState.currX.toFixed(2) + 'deg) rotateY(' + tiltState.currY.toFixed(2) + 'deg) translateZ(' + (tiltState.isHovered ? '20px' : '0px') + ')';
                requestAnimationFrame(renderTilt);
            }
            renderTilt();
        }

        // Section entrance trigger
        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        chooseSection.classList.add('in-view');
                    }
                });
            }, { threshold: 0.1 });
            obs.observe(chooseSection);
        }
    }

    // ========================================================
    function initProfileSection() {
        var wrapper = document.getElementById('chooseProfilePinWrapper') || document.getElementById('choosePinWrapper');
        var chooseSection = document.getElementById('chooseSection');
        var profileSection = document.getElementById('profileSection');
        var productSection = document.getElementById('productDuoSection');
        var whyChooseSection = document.getElementById('whyChooseSection');
        var dogSection = document.getElementById('dogDesignSection');
        var morePetsSection = document.getElementById('morePetsSection');
        var faqSection = document.getElementById('faqSection');
        if (!wrapper || !profileSection) return;

        var duoCards = productSection ? productSection.querySelectorAll('.duo_card') : [];
        var whySpotlight = document.getElementById('whySpotlight');
        var whyColumns = whyChooseSection ? whyChooseSection.querySelectorAll('.compare_table_grid > .compare_col') : [];
        var whyHeader = whyChooseSection ? whyChooseSection.querySelector('.why_choose_header') : null;
        var whyLightTrack = whyChooseSection ? whyChooseSection.querySelector('.why_travel_light_track') : null;

        var targetProgress = 0; // Range: 0.0 to 10.0
        // 0-1: Profile in from right (3.4s)
        // 1-2: Product opens from middle (3.4s)
        // 2-3: Product dwell (3.0s)
        // 3-4: Why Choose from bottom (3.6s)
        // 4-5: Why Choose dwell (2.5s)
        // 5-6: Why Choose columns part like window -> Dog Section appears from middle (3.4s)
        // 6-7: Scroll for 2.0s on Dog Section (dwell)
        // 7-8: More Pets section appears from bottom like a parallax (3.4s)
        // 8-9: Scroll for 2.0s on More Pets section (dwell)
        // 9-10: FAQ section appears from bottom like a parallax (3.4s)
        var currentProgress = 0;
        var profileRevealed = false;
        var rafId = null;
        var handTimer = null;
        var arrowTimer = null;

        // Scroll deltas per stage
        var stage1Delta = 3400;         // Choose -> Profile (3.4s)
        var stage2Delta = 3400;         // Profile -> Product window opens (3.4s)
        var productDwellDelta = 3000;   // Scroll for 3 SECONDS on the Product section!
        var stage4Delta = 3600;         // Why Choose appears from bottom smoothly (3.6s)
        var whyChooseDwellDelta = 2500; // Scroll for 2.5 SECONDS on the Why Choose section!
        var dogSectionDelta = 3400;     // Dog Section appears from middle of comparison columns (3.4s)
        var dogDwellDelta = 2000;       // Scroll for 2.0 SECONDS on the Dog section!
        var morePetsDelta = 3400;       // More Pets section appears from bottom like a parallax (3.4s)
        var morePetsDwellDelta = 2000;  // Scroll for 2.0 SECONDS on More Pets section!
        var faqDelta = 3400;            // FAQ section appears from bottom like a parallax (3.4s)

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function renderScrollProgress() {
            currentProgress = lerp(currentProgress, targetProgress, 0.10);

            if (Math.abs(currentProgress - targetProgress) < 0.002) {
                currentProgress = targetProgress;
            }

            if (currentProgress <= 1.0) {
                // ========================================== 
                // STAGE 1: CHOOSE -> PROFILE SECTION (0.0 to 1.0)
                // ========================================== 
                var p1 = Math.min(1, Math.max(0, currentProgress));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }

                var translateX = (1 - p1) * 100;
                profileSection.style.transform = 'translate3d(' + translateX.toFixed(3) + '%, 0, 0)';
                profileSection.style.opacity = '1';
                profileSection.style.filter = '';
                profileSection.style.visibility = (p1 > 0.005) ? 'visible' : 'hidden';

                if (p1 > 0.3) {
                    profileSection.classList.add('in-view');
                } else {
                    profileSection.classList.remove('in-view');
                }

                if (p1 >= 0.98) {
                    if (!profileRevealed) {
                        profileRevealed = true;
                        profileSection.classList.add('slide-in');

                        if (handTimer) clearTimeout(handTimer);
                        handTimer = setTimeout(function () {
                            profileSection.classList.add('hand-revealed');

                            if (arrowTimer) clearTimeout(arrowTimer);
                            arrowTimer = setTimeout(function () {
                                profileSection.classList.add('arrow-drawn');
                            }, 550);
                        }, 250);
                    }
                } else if (p1 < 0.90) {
                    if (profileRevealed) {
                        profileRevealed = false;
                        if (handTimer) clearTimeout(handTimer);
                        if (arrowTimer) clearTimeout(arrowTimer);
                        profileSection.classList.remove('hand-revealed', 'arrow-drawn', 'slide-in');
                    }
                }

                if (productSection) {
                    productSection.style.clipPath = 'inset(50% 50% 50% 50% round 32px)';
                    productSection.style.webkitClipPath = 'inset(50% 50% 50% 50% round 32px)';
                    productSection.style.transform = 'scale(0.85)';
                    productSection.style.opacity = '0';
                    productSection.style.visibility = 'hidden';
                }
                duoCards.forEach(function (c) {
                    c.classList.remove('in-view');
                    c.style.transform = '';
                    c.style.opacity = '';
                });

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.transform = 'scale(0.88)';
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                    dogSection.classList.remove('in-view', 'dog-animated');
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 2.0) {
                // ========================================== 
                // STAGE 2: PROFILE -> PRODUCT WINDOW SECTION (1.0 to 2.0)
                // Appears from middle like a window opens!
                // ========================================== 
                var p2 = Math.min(1, Math.max(0, currentProgress - 1.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }

                var profScale = 1 - (p2 * 0.08);
                var profBrightness = 1 - (p2 * 0.18);
                var profBlur = p2 * 2.5;
                var profOpacity = 1 - (p2 * 0.25);
                profileSection.style.transform = 'scale(' + profScale.toFixed(3) + ')';
                profileSection.style.filter = 'brightness(' + profBrightness.toFixed(3) + ') blur(' + profBlur.toFixed(1) + 'px)';
                profileSection.style.opacity = profOpacity.toFixed(3);
                profileSection.style.visibility = 'visible';

                if (productSection) {
                    var insetY = (1 - p2) * 50;
                    var insetX = (1 - p2) * 50;
                    var insetRound = (1 - p2) * 32;

                    productSection.style.clipPath = 'inset(' + insetY.toFixed(2) + '% ' + insetX.toFixed(2) + '% ' + insetY.toFixed(2) + '% ' + insetX.toFixed(2) + '% round ' + insetRound.toFixed(1) + 'px)';
                    productSection.style.webkitClipPath = 'inset(' + insetY.toFixed(2) + '% ' + insetX.toFixed(2) + '% ' + insetY.toFixed(2) + '% ' + insetX.toFixed(2) + '% round ' + insetRound.toFixed(1) + 'px)';

                    var prodScale = 0.85 + (p2 * 0.15);
                    var prodOpacity = Math.min(1, p2 * 1.8);

                    productSection.style.transform = 'scale(' + prodScale.toFixed(3) + ')';
                    productSection.style.opacity = prodOpacity.toFixed(3);
                    productSection.style.visibility = (p2 > 0.005) ? 'visible' : 'hidden';
                }

                if (duoCards.length >= 2) {
                    var cardSpread = (1 - p2) * 45;
                    if (p2 >= 0.99) {
                        duoCards[0].style.transform = '';
                        duoCards[1].style.transform = '';
                    } else {
                        duoCards[0].style.transform = 'translate3d(' + (-cardSpread).toFixed(1) + 'px, 0, 0)';
                        duoCards[1].style.transform = 'translate3d(' + cardSpread.toFixed(1) + 'px, 0, 0)';
                    }

                    if (p2 > 0.25) {
                        duoCards[0].classList.add('in-view');
                        duoCards[1].classList.add('in-view');
                    } else {
                        duoCards[0].classList.remove('in-view');
                        duoCards[1].classList.remove('in-view');
                    }
                }

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.transform = 'scale(0.88)';
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                    dogSection.classList.remove('in-view', 'dog-animated');
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 3.0) {
                // ========================================== 
                // STAGE 3: SCROLL FOR 3 SECONDS ON PRODUCT SECTION (2.0 to 3.0)
                // Product section remains completely still, open and interactive!
                // ========================================== 
                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.filter = 'brightness(0.82) blur(2.5px)';
                profileSection.style.opacity = '0.75';
                profileSection.style.visibility = 'visible';

                if (productSection) {
                    productSection.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.webkitClipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.transform = 'scale(1)';
                    productSection.style.opacity = '1';
                    productSection.style.visibility = 'visible';
                }
                duoCards.forEach(function (c) {
                    c.classList.add('in-view');
                    c.style.transform = '';
                });

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.transform = 'scale(0.88)';
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                    dogSection.classList.remove('in-view', 'dog-animated');
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 4.0) {
                // ========================================== 
                // STAGE 4: AFTER 3 SECONDS SCROLL ON PRODUCT SECTION,
                // WHY CHOOSE SECTION APPEARS FROM BOTTOM SMOOTHLY (3.0 to 4.0)
                // ========================================== 
                var p4 = Math.min(1, Math.max(0, currentProgress - 3.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.filter = 'brightness(0.82) blur(2.5px)';
                profileSection.style.opacity = '0.75';
                profileSection.style.visibility = 'visible';

                if (productSection) {
                    productSection.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.webkitClipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.transform = 'scale(1)';
                    productSection.style.opacity = '1';
                    productSection.style.visibility = 'visible';
                }
                duoCards.forEach(function (c) {
                    c.classList.add('in-view');
                    c.style.transform = '';
                });

                if (whyChooseSection) {
                    var translateY = (1 - p4) * 100;
                    whyChooseSection.style.transform = 'translate3d(0, ' + translateY.toFixed(3) + '%, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = (p4 > 0.005) ? 'visible' : 'hidden';

                    if (p4 > 0.15) {
                        whyChooseSection.classList.add('in-view');
                    } else {
                        whyChooseSection.classList.remove('in-view', 'spotlight-active');
                    }

                    if (p4 >= 0.80) {
                        whyChooseSection.classList.add('spotlight-active');
                    } else {
                        whyChooseSection.classList.remove('spotlight-active');
                    }
                }

                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.transform = 'scale(0.88)';
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                    dogSection.classList.remove('in-view', 'dog-animated');
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 5.0) {
                // ========================================== 
                // STAGE 5: SCROLL FOR 2.5 SECONDS ON WHY CHOOSE SECTION! (4.0 to 5.0)
                // Why Choose section remains completely stationary, in-view, spotlight active!
                // Dog section remains closed in center slit until 2.5s finishes!
                // ========================================== 
                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.filter = 'brightness(0.82) blur(2.5px)';
                profileSection.style.opacity = '0.75';

                if (productSection) {
                    productSection.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.webkitClipPath = 'inset(0% 0% 0% 0% round 0px)';
                    productSection.style.transform = 'scale(1)';
                    productSection.style.opacity = '1';
                }

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 0, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = 'visible';
                    whyChooseSection.classList.add('in-view', 'spotlight-active');
                }

                // Comparison columns remain intact and in position
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                // Dog section remains closed and hidden
                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                    dogSection.style.transform = 'scale(0.88)';
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                    dogSection.classList.remove('in-view', 'dog-animated');
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 6.0) {
                // ========================================== 
                // STAGE 6: AFTER 2.5s SCROLL ON WHY CHOOSE,
                // WHY CHOOSE COLUMNS PART LIKE TWO SIDES OF A WINDOW OPENING,
                // AND DOG SECTION APPEARS FROM THE MIDDLE! (5.0 to 6.0)
                // ========================================== 
                var p5 = Math.min(1, Math.max(0, currentProgress - 5.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.opacity = '0.75';

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 0, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = 'visible';
                }

                // Window Parting Effect on Comparison Columns:
                var colShiftLeft = p5 * 115;
                if (whyColumns[0]) {
                    whyColumns[0].style.transform = 'translate3d(' + (-colShiftLeft).toFixed(2) + '%, 0, 0)';
                }
                if (whyColumns[1]) {
                    whyColumns[1].style.transform = 'translate3d(' + (-colShiftLeft).toFixed(2) + '%, 0, 0)';
                }

                var colShiftRight = p5 * 115;
                if (whyColumns[2]) {
                    whyColumns[2].style.transform = 'translate3d(' + colShiftRight.toFixed(2) + '%, 0, 0)';
                }
                if (whyColumns[3]) {
                    whyColumns[3].style.transform = 'translate3d(' + colShiftRight.toFixed(2) + '%, 0, 0)';
                }

                var colOpacity = Math.max(0, 1 - (p5 * 0.75));
                whyColumns.forEach(function (col) {
                    col.style.opacity = colOpacity.toFixed(3);
                });

                var headY = -p5 * 50;
                var headOpacity = Math.max(0, 1 - (p5 * 1.3));
                if (whyHeader) {
                    whyHeader.style.transform = 'translate3d(0, ' + headY.toFixed(1) + 'px, 0)';
                    whyHeader.style.opacity = headOpacity.toFixed(3);
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = Math.max(0, 1 - (p5 * 1.5)).toFixed(3);
                }

                // Dog Section appears from the middle between the parting columns:
                if (dogSection) {
                    var dogInsetX = (1 - p5) * 50;
                    var dogInsetRound = (1 - p5) * 24;

                    dogSection.style.clipPath = 'inset(0% ' + dogInsetX.toFixed(2) + '% 0% ' + dogInsetX.toFixed(2) + '% round ' + dogInsetRound.toFixed(1) + 'px)';
                    dogSection.style.webkitClipPath = 'inset(0% ' + dogInsetX.toFixed(2) + '% 0% ' + dogInsetX.toFixed(2) + '% round ' + dogInsetRound.toFixed(1) + 'px)';

                    var dogScale = 0.88 + (p5 * 0.12);
                    var dogOpacity = Math.min(1, p5 * 1.6);

                    dogSection.style.transform = 'scale(' + dogScale.toFixed(3) + ')';
                    dogSection.style.opacity = dogOpacity.toFixed(3);
                    dogSection.style.visibility = (p5 > 0.005) ? 'visible' : 'hidden';

                    if (p5 >= 0.85) {
                        if (!dogSection.classList.contains('dog-animated')) {
                            dogSection.classList.add('dog-animated');
                        }
                    } else if (p5 < 0.60) {
                        dogSection.classList.remove('dog-animated');
                    }

                    if (p5 >= 0.99) {
                        dogSection.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
                        dogSection.style.webkitClipPath = 'inset(0% 0% 0% 0% round 0px)';
                        dogSection.style.transform = 'scale(1)';
                        dogSection.style.opacity = '1';
                    }
                }

                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 7.0) {
                // ========================================== 
                // STAGE 7: SCROLL FOR 2 SECONDS ON DOG SECTION (6.0 to 7.0)
                // Dog section remains completely open, stationary, fully visible, interactive!
                // More Pets section waits hidden below until 2s dwell finishes.
                // ========================================== 
                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
                    dogSection.style.webkitClipPath = 'inset(0% 0% 0% 0% round 0px)';
                    dogSection.style.transform = 'scale(1)';
                    dogSection.style.opacity = '1';
                    dogSection.style.visibility = 'visible';
                    if (!dogSection.classList.contains('dog-animated')) {
                        dogSection.classList.add('dog-animated');
                    }
                }

                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                    morePetsSection.classList.remove('pets-animated');
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 8.0) {
                // ========================================== 
                // STAGE 8: AFTER 2s SCROLL ON DOG SECTION,
                // MORE PETS SECTION APPEARS FROM BOTTOM LIKE A PARALLAX! (7.0 to 8.0)
                // ========================================== 
                var p7 = Math.min(1, Math.max(0, currentProgress - 7.0));

                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }

                if (dogSection) {
                    var dogParallaxY = -p7 * 28;
                    var dogParallaxScale = 1 - (p7 * 0.05);
                    var dogParallaxOpacity = Math.max(0, 1 - (p7 * 0.5));
                    dogSection.style.transform = 'translate3d(0, ' + dogParallaxY.toFixed(2) + '%, 0) scale(' + dogParallaxScale.toFixed(3) + ')';
                    dogSection.style.opacity = dogParallaxOpacity.toFixed(3);
                    dogSection.style.visibility = (p7 < 0.99) ? 'visible' : 'hidden';
                }

                if (morePetsSection) {
                    var morePetsY = (1 - p7) * 100;
                    morePetsSection.style.transform = 'translate3d(0, ' + morePetsY.toFixed(2) + '%, 0)';
                    morePetsSection.style.opacity = Math.min(1, p7 * 1.6).toFixed(3);
                    morePetsSection.style.visibility = (p7 > 0.005) ? 'visible' : 'hidden';

                    if (p7 >= 0.85) {
                        if (!morePetsSection.classList.contains('pets-animated')) {
                            morePetsSection.classList.add('pets-animated');
                        }
                    } else if (p7 < 0.60) {
                        morePetsSection.classList.remove('pets-animated');
                    }

                    if (p7 >= 0.99) {
                        morePetsSection.style.transform = 'translate3d(0, 0%, 0)';
                        morePetsSection.style.opacity = '1';
                    }
                }

                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else if (currentProgress <= 9.0) {
                // ========================================== 
                // STAGE 9: SCROLL FOR 2.0 SECONDS ON MORE PETS SECTION! (8.0 to 9.0)
                // ========================================== 
                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }
                if (dogSection) {
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                }
                if (morePetsSection) {
                    morePetsSection.style.transform = 'translate3d(0, 0%, 0)';
                    morePetsSection.style.opacity = '1';
                    morePetsSection.style.visibility = 'visible';
                    if (!morePetsSection.classList.contains('pets-animated')) {
                        morePetsSection.classList.add('pets-animated');
                    }
                }
                if (faqSection) {
                    faqSection.style.transform = 'translate3d(0, 100%, 0)';
                    faqSection.style.opacity = '0';
                    faqSection.style.visibility = 'hidden';
                    faqSection.classList.remove('faq-animated');
                }

            } else {
                // ========================================== 
                // STAGE 10: FAQ SECTION APPEARS FROM BOTTOM LIKE A PARALLAX! (9.0 to 10.0)
                // ========================================== 
                var p9 = Math.min(1, Math.max(0, currentProgress - 9.0));

                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }
                if (dogSection) {
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                }

                if (morePetsSection) {
                    // Parallax on more pets section: moves upward slightly as FAQ rises
                    var morePetsParallaxY = -p9 * 25;
                    var morePetsParallaxScale = 1 - (p9 * 0.04);
                    var morePetsParallaxOpacity = Math.max(0, 1 - (p9 * 0.5));
                    morePetsSection.style.transform = 'translate3d(0, ' + morePetsParallaxY.toFixed(2) + '%, 0) scale(' + morePetsParallaxScale.toFixed(3) + ')';
                    morePetsSection.style.opacity = morePetsParallaxOpacity.toFixed(3);
                    morePetsSection.style.visibility = (p9 < 0.99) ? 'visible' : 'hidden';
                }

                if (faqSection) {
                    // Parallax entrance from bottom:
                    var faqY = (1 - p9) * 100;
                    faqSection.style.transform = 'translate3d(0, ' + faqY.toFixed(2) + '%, 0)';
                    faqSection.style.opacity = Math.min(1, p9 * 1.6).toFixed(3);
                    faqSection.style.visibility = (p9 > 0.005) ? 'visible' : 'hidden';

                    // Trigger the 4-step visual stage sequence when in view:
                    // 1. Mobile phone appears
                    // 2. Arc draws top to bottom
                    // 3. Medal shows
                    // 4. Dog homepage appears in mobile screen
                    if (p9 >= 0.85) {
                        if (!faqSection.classList.contains('faq-animated')) {
                            faqSection.classList.add('faq-animated');
                        }
                    } else if (p9 < 0.60) {
                        faqSection.classList.remove('faq-animated');
                    }

                    if (p9 >= 0.99) {
                        faqSection.style.transform = 'translate3d(0, 0%, 0)';
                        faqSection.style.opacity = '1';
                    }
                }
            }

            if (currentProgress !== targetProgress) {
                rafId = requestAnimationFrame(renderScrollProgress);
            } else {
                rafId = null;
            }
        }

        function wakeRender() {
            if (!rafId) {
                rafId = requestAnimationFrame(renderScrollProgress);
            }
        }

        function resetAll() {
            targetProgress = 0;
            currentProgress = 0;
            profileRevealed = false;
            if (handTimer) {
                clearTimeout(handTimer);
                handTimer = null;
            }
            if (arrowTimer) {
                clearTimeout(arrowTimer);
                arrowTimer = null;
            }
            profileSection.classList.remove('slide-in', 'hand-revealed', 'arrow-drawn', 'in-view');
            profileSection.style.transform = 'translate3d(100%, 0, 0)';
            profileSection.style.opacity = '1';
            profileSection.style.filter = '';
            profileSection.style.visibility = 'hidden';
            if (chooseSection) {
                chooseSection.style.transform = 'translate3d(0, 0, 0)';
                chooseSection.style.opacity = '1';
                chooseSection.style.visibility = 'visible';
            }
            if (productSection) {
                productSection.style.clipPath = 'inset(50% 50% 50% 50% round 32px)';
                productSection.style.webkitClipPath = 'inset(50% 50% 50% 50% round 32px)';
                productSection.style.transform = 'scale(0.85)';
                productSection.style.opacity = '0';
                productSection.style.visibility = 'hidden';
            }
            duoCards.forEach(function (c) {
                c.classList.remove('in-view');
                c.style.transform = '';
                c.style.opacity = '';
            });
            if (whyChooseSection) {
                whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                whyChooseSection.style.opacity = '1';
                whyChooseSection.style.visibility = 'hidden';
                whyChooseSection.classList.remove('in-view', 'spotlight-active');
            }
            whyColumns.forEach(function (col) {
                col.style.transform = '';
                col.style.opacity = '';
            });
            if (whyHeader) {
                whyHeader.style.transform = '';
                whyHeader.style.opacity = '';
            }
            if (whyLightTrack) {
                whyLightTrack.style.opacity = '';
            }

            if (dogSection) {
                dogSection.style.clipPath = 'inset(0% 50% 0% 50% round 24px)';
                dogSection.style.webkitClipPath = 'inset(0% 50% 0% 50% round 24px)';
                dogSection.style.transform = 'scale(0.88)';
                dogSection.style.opacity = '0';
                dogSection.style.visibility = 'hidden';
                dogSection.classList.remove('dog-animated');
            }
            if (morePetsSection) {
                morePetsSection.style.transform = 'translate3d(0, 100%, 0)';
                morePetsSection.style.opacity = '0';
                morePetsSection.style.visibility = 'hidden';
                morePetsSection.classList.remove('pets-animated');
            }
            if (faqSection) {
                faqSection.style.transform = 'translate3d(0, 100%, 0)';
                faqSection.style.opacity = '0';
                faqSection.style.visibility = 'hidden';
                faqSection.classList.remove('faq-animated');
            }
            var dogTagInner = document.getElementById('dogTagInner');
            if (dogTagInner) {
                dogTagInner.style.transform = '';
            }
        }

        // Initialize pinned sections to stage 0 on load/reload
        resetAll();

        // Active mouse wheel scroll handler (bidirectional 6-stage navigation)
        window.addEventListener('wheel', function (e) {
            if (window.innerWidth <= 991) return;

            var rect = wrapper.getBoundingClientRect();
            // Is pinned container active in viewport?
            var isInsidePin = (rect.top <= 60 || targetProgress > 0) && (rect.bottom > 120);
            if (!isInsidePin) return;

            if (e.deltaY > 0) {
                // User scrolling DOWN:
                if (targetProgress < 1.0) {
                    // Stage 1: Choose -> Profile (3.4s scroll)
                    targetProgress = Math.min(1.0, targetProgress + (e.deltaY / stage1Delta));
                    wakeRender();
                } else if (targetProgress >= 1.0 && targetProgress < 2.0) {
                    // Stage 2: Profile -> Product window opens (3.4s scroll)
                    if (currentProgress >= 0.96) {
                        targetProgress = Math.min(2.0, targetProgress + (e.deltaY / stage2Delta));
                        wakeRender();
                    }
                } else if (targetProgress >= 2.0 && targetProgress < 3.0) {
                    // Stage 3: Scroll for 3 SECONDS on the Product section!
                    if (currentProgress >= 1.96) {
                        targetProgress = Math.min(3.0, targetProgress + (e.deltaY / productDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 3.0 && targetProgress < 4.0) {
                    // Stage 4: Why Choose appears from bottom smoothly (3.6s scroll)
                    if (currentProgress >= 2.96) {
                        targetProgress = Math.min(4.0, targetProgress + (e.deltaY / stage4Delta));
                        wakeRender();
                    }
                } else if (targetProgress >= 4.0 && targetProgress < 5.0) {
                    // Stage 5: Scroll for 2.5 SECONDS on the Why Choose section!
                    if (currentProgress >= 3.96) {
                        targetProgress = Math.min(5.0, targetProgress + (e.deltaY / whyChooseDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 5.0 && targetProgress < 6.0) {
                    // Stage 6: Why Choose columns part like window -> Dog Section appears from middle!
                    if (currentProgress >= 4.96) {
                        targetProgress = Math.min(6.0, targetProgress + (e.deltaY / dogSectionDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 6.0 && targetProgress < 7.0) {
                    // Stage 7: Scroll for 2.0 SECONDS on the Dog section!
                    if (currentProgress >= 5.96) {
                        targetProgress = Math.min(7.0, targetProgress + (e.deltaY / dogDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 7.0 && targetProgress < 8.0) {
                    // Stage 8: More Pets section appears from bottom like a parallax! (3.4s scroll)
                    if (currentProgress >= 6.96) {
                        targetProgress = Math.min(8.0, targetProgress + (e.deltaY / morePetsDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 8.0 && targetProgress < 9.0) {
                    // Stage 9: Scroll for 2.0 SECONDS on More Pets section! (dwell)
                    if (currentProgress >= 7.96) {
                        targetProgress = Math.min(9.0, targetProgress + (e.deltaY / morePetsDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 9.0 && targetProgress < 10.0) {
                    // Stage 10: FAQ section appears from bottom like a parallax! (3.4s scroll)
                    if (currentProgress >= 8.96) {
                        targetProgress = Math.min(10.0, targetProgress + (e.deltaY / faqDelta));
                        wakeRender();
                    }
                }
            } else if (e.deltaY < 0) {
                // User scrolling UP:
                if (targetProgress > 9.0) {
                    // Stage 10 Reverse: FAQ section slides back down to bottom
                    targetProgress = Math.max(9.0, targetProgress - (Math.abs(e.deltaY) / faqDelta));
                    wakeRender();
                } else if (targetProgress <= 9.0 && targetProgress > 8.0) {
                    // Stage 9 Reverse: Scroll back up on More Pets section (2.0s dwell)
                    if (currentProgress <= 9.04) {
                        targetProgress = Math.max(8.0, targetProgress - (Math.abs(e.deltaY) / morePetsDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 8.0 && targetProgress > 7.0) {
                    // Stage 8 Reverse: More Pets section slides back down to bottom
                    if (currentProgress <= 8.04) {
                        targetProgress = Math.max(7.0, targetProgress - (Math.abs(e.deltaY) / morePetsDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 7.0 && targetProgress > 6.0) {
                    // Stage 7 Reverse: Scroll back up on Dog section (2.0s dwell)
                    if (currentProgress <= 7.04) {
                        targetProgress = Math.max(6.0, targetProgress - (Math.abs(e.deltaY) / dogDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 6.0 && targetProgress > 5.0) {
                    // Stage 6 Reverse: Dog Section window closes back, columns slide back together
                    if (currentProgress <= 6.04) {
                        targetProgress = Math.max(5.0, targetProgress - (Math.abs(e.deltaY) / dogSectionDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 5.0 && targetProgress > 4.0) {
                    // Stage 5 Reverse: Scroll back up on Why Choose section (2.5s dwell)
                    if (currentProgress <= 5.04) {
                        targetProgress = Math.max(4.0, targetProgress - (Math.abs(e.deltaY) / whyChooseDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 4.0 && targetProgress > 3.0) {
                    // Stage 4 Reverse: Why choose section slides back down to bottom smoothly
                    if (currentProgress <= 4.04) {
                        targetProgress = Math.max(3.0, targetProgress - (Math.abs(e.deltaY) / stage4Delta));
                        wakeRender();
                    }
                } else if (targetProgress <= 3.0 && targetProgress > 2.0) {
                    // Stage 3 Reverse: Scroll back up on Product section (3s dwell)
                    if (currentProgress <= 3.04) {
                        targetProgress = Math.max(2.0, targetProgress - (Math.abs(e.deltaY) / productDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 2.0 && targetProgress > 1.0) {
                    // Stage 2 Reverse: Product window closes back only after user finishes Product section
                    if (currentProgress <= 2.04) {
                        targetProgress = Math.max(1.0, targetProgress - (Math.abs(e.deltaY) / stage2Delta));
                        wakeRender();
                    }
                } else if (targetProgress <= 1.0 && targetProgress > 0.0) {
                    // Stage 1 Reverse: Profile slides back out to right only after Product window has closed!
                    if (currentProgress <= 1.04) {
                        targetProgress = Math.max(0.0, targetProgress - (Math.abs(e.deltaY) / stage1Delta));
                        wakeRender();
                    }
                }
            }
        }, { passive: true });

        // Phase 5 (80-100%): Mouse-following spotlight interactive experience
        if (whyChooseSection && whySpotlight) {
            whyChooseSection.addEventListener('mousemove', function (e) {
                var rect = whyChooseSection.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                whySpotlight.style.left = x + 'px';
                whySpotlight.style.top = y + 'px';
            });
            whyChooseSection.addEventListener('mouseleave', function () {
                whySpotlight.style.opacity = '0';
            });
            whyChooseSection.addEventListener('mouseenter', function () {
                if (whyChooseSection.classList.contains('spotlight-active')) {
                    whySpotlight.style.opacity = '1';
                }
            });
        }

        // Scroll check for reset when user scrolls back up past the Choose section
        window.addEventListener('scroll', function () {
            if (window.innerWidth <= 991) {
                var profRect = profileSection.getBoundingClientRect();
                if (profRect.top < window.innerHeight * 0.8) {
                    profileSection.classList.add('hand-revealed', 'arrow-drawn', 'in-view');
                }
                if (productSection) {
                    var prodRect = productSection.getBoundingClientRect();
                    if (prodRect.top < window.innerHeight * 0.85) {
                        duoCards.forEach(function (c) { c.classList.add('in-view'); });
                    }
                }
                if (whyChooseSection) {
                    var whyRect = whyChooseSection.getBoundingClientRect();
                    if (whyRect.top < window.innerHeight * 0.85) {
                        whyChooseSection.classList.add('in-view');
                    }
                }

                return;
            }

            var rect = wrapper.getBoundingClientRect();
            var winH = window.innerHeight;
            if (rect.top > winH * 0.95) {
                if (chooseSection && chooseSection.classList.contains('in-view')) {
                    chooseSection.classList.remove('in-view');
                }
            } else if (rect.top < winH * 0.88 && rect.bottom > 80) {
                if (chooseSection && !chooseSection.classList.contains('in-view')) {
                    chooseSection.classList.add('in-view');
                }
            }
            if (rect.top > window.innerHeight * 0.7) {
                if (targetProgress > 0 || profileRevealed) {
                    resetAll();
                }
            }
        }, { passive: true });

        window.addEventListener('resize', function () {
            if (window.innerWidth <= 991) {
                if (chooseSection) {
                    chooseSection.style.transform = '';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }
                profileSection.style.transform = '';
                profileSection.style.opacity = '1';
                profileSection.style.filter = '';
                profileSection.style.visibility = 'visible';
                if (productSection) {
                    productSection.style.clipPath = 'none';
                    productSection.style.webkitClipPath = 'none';
                    productSection.style.transform = '';
                    productSection.style.opacity = '1';
                    productSection.style.visibility = 'visible';
                }
                if (whyChooseSection) {
                    whyChooseSection.style.transform = '';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = 'visible';
                }
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '';
                }
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'none';
                    dogSection.style.webkitClipPath = 'none';
                    dogSection.style.transform = '';
                    dogSection.style.opacity = '1';
                    dogSection.style.visibility = 'visible';
                }
                if (faqSection) {
                    faqSection.style.transform = '';
                    faqSection.style.opacity = '1';
                    faqSection.style.visibility = 'visible';
                }
            }
        }, { passive: true });
    }

    // ========================================================
    // 5b. Dog Section Intersection Observer (Scroll-Triggered Animation)
    // ========================================================
    function initDogSectionObserver() {
        var dogSection = document.getElementById('dogDesignSection');
        if (!dogSection) return;

        // On mobile / tablet: Use Intersection Observer to trigger when scrolled into view
        if (window.innerWidth <= 991 && 'IntersectionObserver' in window) {
            var dogObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !dogSection.classList.contains('dog-animated')) {
                        dogSection.classList.add('dog-animated');
                        dogObserver.unobserve(dogSection);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            dogObserver.observe(dogSection);
        }
    }

    // ========================================================
    // 5c. Dog Design Showcase Section AI Prompt Interactive Demo
    // ========================================================
    function initDogDesignInteractive() {
        var dogSection = document.getElementById('dogDesignSection');
        var promptBtn = document.getElementById('dogPromptBtn');
        var promptPlaceholder = dogSection ? dogSection.querySelector('.dog_prompt_placeholder') : null;

        // Interactive AI Prompt Generator button click feedback
        if (promptBtn) {
            var prompts = [
                "A golden retriever in the mountains at sunset...",
                "A playful french bulldog in a blooming flower meadow...",
                "A majestic husky running through arctic northern lights...",
                "A cute corgi wearing astronaut goggles in space...",
                "A happy labrador retriever on a sunny golden beach..."
            ];
            var promptIdx = 0;

            promptBtn.addEventListener('click', function () {
                promptBtn.style.transform = 'scale(0.92)';
                setTimeout(function () {
                    promptBtn.style.transform = '';
                }, 180);

                if (promptPlaceholder) {
                    promptPlaceholder.style.opacity = '0';
                    promptPlaceholder.style.transform = 'translateY(-6px)';
                    promptPlaceholder.style.transition = 'all 0.25s ease';

                    setTimeout(function () {
                        promptIdx = (promptIdx + 1) % prompts.length;
                        promptPlaceholder.textContent = prompts[promptIdx];
                        promptPlaceholder.style.transform = 'translateY(6px)';
                        setTimeout(function () {
                            promptPlaceholder.style.opacity = '1';
                            promptPlaceholder.style.transform = 'translateY(0)';
                        }, 50);
                    }, 250);
                }
            });
        }
    }

    // ========================================================
    // 6. Top Bar Close Handler
    // ========================================================
    function initTopBarClose() {
        var topBarClose = document.getElementById('topBarClose');
        var topBar = document.getElementById('topBar');
        if (topBarClose && topBar) {
            topBarClose.addEventListener('click', function () {
                topBar.style.transition = 'all 0.4s ease';
                topBar.style.height = '0px';
                topBar.style.padding = '0px';
                topBar.style.opacity = '0';
                topBar.style.overflow = 'hidden';
            });
        }
    }

    // ========================================================
    // 7. Back To Top Handler
    // ========================================================
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', function () {
            if ((window.pageYOffset || document.documentElement.scrollTop) > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, { passive: true });

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================================
    // 8. Product Duo Showcase Section Scroll Entrance & Interactive Hover
    // ========================================================
    function initProductDuoSection() {
        var section = document.getElementById('productDuoSection');
        if (!section) return;

        var cards = section.querySelectorAll('.duo_card');
        if (!cards.length) return;

        // 3D slight rotation, morphing specifications, and smooth CTA fade are accelerated and rendered via CSS
        // Mobile Scroll Reveal Observer
        if (window.innerWidth <= 991 && 'IntersectionObserver' in window) {
            var duoObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        cards.forEach(function (card, index) {
                            setTimeout(function () {
                                card.classList.add('in-view');
                            }, index * 160);
                        });
                        duoObserver.unobserve(section);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            duoObserver.observe(section);
        } else if (window.innerWidth <= 991) {
            cards.forEach(function (c) { c.classList.add('in-view'); });
        }

        // Interactive Callouts Highlight on Card 2
        var tagCard = section.querySelector('[data-duo-card="tag"]');
        if (tagCard) {
            var labels = tagCard.querySelectorAll('.callout_label');
            var dots = tagCard.querySelectorAll('.svg_dot');
            var lines = tagCard.querySelectorAll('.svg_line');

            labels.forEach(function (label, idx) {
                label.addEventListener('mouseenter', function () {
                    if (dots[idx]) {
                        dots[idx].style.fill = '#C89C50';
                        dots[idx].style.transform = 'scale(1.5)';
                    }
                    if (lines[idx]) {
                        lines[idx].style.stroke = '#C89C50';
                        lines[idx].style.strokeWidth = '2';
                    }
                });
                label.addEventListener('mouseleave', function () {
                    if (dots[idx]) {
                        dots[idx].style.fill = '';
                        dots[idx].style.transform = '';
                    }
                    if (lines[idx]) {
                        lines[idx].style.stroke = '';
                        lines[idx].style.strokeWidth = '';
                    }
                });
            });
        }
    }
})();

    // ========================================================
    // 5d. More Pets Section Intersection Observer (Mobile)
    // ========================================================
    function initMorePetsObserver() {
        var morePetsSection = document.getElementById('morePetsSection');
        if (!morePetsSection) return;

        if (window.innerWidth <= 991 && 'IntersectionObserver' in window) {
            var petsObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !morePetsSection.classList.contains('pets-animated')) {
                        morePetsSection.classList.add('pets-animated');
                        petsObserver.unobserve(morePetsSection);
                    }
                });
            }, {
                threshold: 0.20,
                rootMargin: '0px 0px -40px 0px'
            });

            petsObserver.observe(morePetsSection);
        }
    }


    // ========================================================
    // 5e. Frequently Asked Questions (FAQ) Accordion
    // ========================================================
    function initFaqAccordion() {
        var accordion = document.getElementById('faqAccordion');
        if (!accordion) return;

        var items = accordion.querySelectorAll('.faq_item');
        items.forEach(function (item) {
            var btn = item.querySelector('.faq_question');
            var answer = item.querySelector('.faq_answer');
            if (!btn || !answer) return;

            btn.addEventListener('click', function () {
                var isOpen = item.classList.contains('active');

                // Close all items
                items.forEach(function (otherItem) {
                    otherItem.classList.remove('active');
                    var otherBtn = otherItem.querySelector('.faq_question');
                    var otherAns = otherItem.querySelector('.faq_answer');
                    var otherIcon = otherItem.querySelector('.faq_arrow_icon i');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherAns) {
                        if (window.jQuery) {
                            $(otherAns).slideUp(220);
                        } else {
                            otherAns.style.display = 'none';
                        }
                    }
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                });

                // If this item was closed, open it
                if (!isOpen) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                    if (window.jQuery) {
                        $(answer).slideDown(220);
                    } else {
                        answer.style.display = 'block';
                    }
                    var icon = item.querySelector('.faq_arrow_icon i');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            });
        });
    }

    // ========================================================
    // 5f. FAQ Section Intersection Observer (Mobile)
    // ========================================================
    function initFaqObserver() {
        var faqSection = document.getElementById('faqSection');
        if (!faqSection) return;

        if (window.innerWidth <= 991 && 'IntersectionObserver' in window) {
            var faqObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !faqSection.classList.contains('faq-animated')) {
                        faqSection.classList.add('faq-animated');
                        faqObserver.unobserve(faqSection);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            faqObserver.observe(faqSection);
        }
    }
