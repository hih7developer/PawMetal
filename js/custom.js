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
        initFaqInteractive();
        initFaqObserver();
        initFooter();
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

        // Switch to Product (Cius Labs Spatial Morph & Staggered Reveal)
        function switchProduct(newIndex, direction) {
            if (newIndex === currentIndex && !isSwitching) return;
            if (isSwitching) return;
            isSwitching = true;

            if (direction === undefined) {
                direction = newIndex > currentIndex ? 1 : -1;
            }

            var oldProduct = products[currentIndex];
            var newProduct = products[newIndex];

            // 1. Smooth 3D Y-Axis Spin with Depth Scale
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

            // 2. Giant Outlined Typography in Depth
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

            // 6. Right Information Panel with Cius Labs Cascading Staggered Children
            infoCards.forEach(function (card, idx) {
                if (idx === newIndex) {
                    card.classList.remove('active');
                    void card.offsetWidth; // Force reflow to re-trigger staggered animations
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
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

        // Cius Labs Mouse-Follow 3D Tilt & Magnetic Specular Interaction on Picker Items
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            pickerItems.forEach(function (item) {
                var itemRect = null;
                var tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
                var magX = 0, magY = 0, targetMagX = 0, targetMagY = 0;
                var isItemHovered = false;
                var animId = null;

                function updateItemMotion() {
                    var ease = 0.12;
                    tiltX += (targetTiltX - tiltX) * ease;
                    tiltY += (targetTiltY - tiltY) * ease;
                    magX += (targetMagX - magX) * ease;
                    magY += (targetMagY - magY) * ease;

                    item.style.setProperty('--tilt-x', tiltX.toFixed(2));
                    item.style.setProperty('--tilt-y', tiltY.toFixed(2));
                    item.style.setProperty('--mag-x', magX.toFixed(2));
                    item.style.setProperty('--mag-y', magY.toFixed(2));

                    if (isItemHovered || Math.abs(targetTiltX - tiltX) > 0.05 || Math.abs(magX - targetMagX) > 0.05) {
                        animId = requestAnimationFrame(updateItemMotion);
                    } else {
                        animId = null;
                    }
                }

                item.addEventListener('mouseenter', function () {
                    itemRect = item.getBoundingClientRect();
                    isItemHovered = true;
                    if (!animId) animId = requestAnimationFrame(updateItemMotion);
                });

                item.addEventListener('mousemove', function (e) {
                    if (!itemRect) itemRect = item.getBoundingClientRect();
                    var relX = e.clientX - itemRect.left;
                    var relY = e.clientY - itemRect.top;
                    item.style.setProperty('--mouse-x', relX + 'px');
                    item.style.setProperty('--mouse-y', relY + 'px');

                    var normX = (relX / itemRect.width - 0.5) * 2;
                    var normY = (relY / itemRect.height - 0.5) * 2;

                    targetTiltX = normX * 7;  // Yaw (deg)
                    targetTiltY = -normY * 7; // Pitch (deg)
                    targetMagX = normX * 4;  // Magnetic pull (px)
                    targetMagY = normY * 3;
                });

                item.addEventListener('mouseleave', function () {
                    isItemHovered = false;
                    targetTiltX = 0;
                    targetTiltY = 0;
                    targetMagX = 0;
                    targetMagY = 0;
                    itemRect = null;
                });
            });
        }

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

        // Cursor-Responsive 3D Tilt Rig with Multi-Plane Spatial Depth (Cius Labs Style)
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

                tiltRig.style.transform = 'perspective(1200px) rotateX(' + tiltState.currX.toFixed(2) + 'deg) rotateY(' + tiltState.currY.toFixed(2) + 'deg) translateZ(' + (tiltState.isHovered ? '24px' : '0px') + ')';

                // Multi-plane depth parallax
                // 1. Giant Outlined Typography moves inversely in depth
                var activeType = chooseSection.querySelector('.stage_giant_type.active');
                if (activeType) {
                    var typeX = -tiltState.currY * 0.45;
                    var typeY = tiltState.currX * 0.35;
                    activeType.style.transform = 'translate(-50%, -50%) translate3d(' + typeX.toFixed(2) + 'px, ' + typeY.toFixed(2) + 'px, -60px) scale(' + (tiltState.isHovered ? '1.02' : '1') + ')';
                }

                // 2. Active Product floats forward with responsive depth
                var activeProduct = chooseSection.querySelector('.showcase_product.active .product_3d_img');
                if (activeProduct) {
                    var prodX = tiltState.currY * 0.35;
                    var prodY = -tiltState.currX * 0.30;
                    activeProduct.style.transform = 'translate3d(' + prodX.toFixed(2) + 'px, ' + prodY.toFixed(2) + 'px, 35px) scale(' + (tiltState.isHovered ? '1.045' : '1') + ')';
                }

                // 3. Contact Shadow moves realistically opposite to product tilt
                var activeShadow = chooseSection.querySelector('.showcase_product.active .product_contact_shadow');
                if (activeShadow) {
                    var shadowShift = -tiltState.currY * 0.45;
                    var shadowScale = 1 - Math.abs(tiltState.currY) * 0.005;
                    activeShadow.style.transform = 'translateX(calc(-50% + ' + shadowShift.toFixed(2) + 'px)) scale(' + shadowScale.toFixed(3) + ')';
                }

                requestAnimationFrame(renderTilt);
            }
            renderTilt();
        }

        // Magnetic Button Interaction on Info CTA Buttons (Cius Labs Style)
        var ctaButtons = chooseSection.querySelectorAll('.showcase_cta_btn');
        ctaButtons.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var relX = e.clientX - rect.left - rect.width / 2;
                var relY = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (relX * 0.22).toFixed(2) + 'px, ' + (relY * 0.22).toFixed(2) + 'px) scale(1.02)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });

        // Section entrance trigger with immediate in-view check
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

        var initRect = chooseSection.getBoundingClientRect();
        if (initRect.top < window.innerHeight && initRect.bottom > 0) {
            chooseSection.classList.add('in-view');
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
        var footerSection = document.getElementById('footerSection');
        if (!wrapper || !profileSection) return;

        var duoCards = productSection ? productSection.querySelectorAll('.duo_card') : [];
        var whySpotlight = document.getElementById('whySpotlight');
        var whyTitleStage = document.getElementById('whyTitleStage');
        var whyChooseTitle = document.getElementById('whyChooseTitle');
        var whyTitleFill = document.getElementById('whyTitleFill');
        var whyTitleOutline = document.getElementById('whyTitleOutline');
        var whySectionGlowBeam = document.getElementById('whySectionGlowBeam');
        var whySubtitle = document.getElementById('whySubtitle');
        var whySubtitleWords = whySubtitle ? whySubtitle.querySelectorAll('.para_word') : [];
        var compareTableWrapper = whyChooseSection ? whyChooseSection.querySelector('.compare_table_wrapper') : null;
        var whyColumns = whyChooseSection ? whyChooseSection.querySelectorAll('.compare_table_grid > .compare_col') : [];
        var compareColHeaders = whyChooseSection ? whyChooseSection.querySelectorAll('.compare_feat_header, .compare_prod_header') : [];
        var whyHeader = whyChooseSection ? whyChooseSection.querySelector('.why_choose_header') : null;

        // Group rows and icons by row index (0 to 9) for row-by-row scroll choreography
        var compareTableRows = [];
        var compareRowIcons = [];
        if (whyChooseSection) {
            var featRows = whyChooseSection.querySelectorAll('.compare_feat_row');
            var prodCols = whyChooseSection.querySelectorAll('.compare_col_product');
            for (var r = 0; r < 10; r++) {
                var rowElements = [];
                var rowIcn = [];
                if (featRows[r]) rowElements.push(featRows[r]);
                prodCols.forEach(function (col) {
                    var valRows = col.querySelectorAll('.compare_val_row');
                    if (valRows[r]) {
                        rowElements.push(valRows[r]);
                        var icn = valRows[r].querySelector('.compare_icon');
                        if (icn) rowIcn.push(icn);
                    }
                });
                compareTableRows.push(rowElements);
                compareRowIcons.push(rowIcn);
            }
        }

        function getWhyHeaderCenterOffset() {
            var winH = window.innerHeight || 800;
            return Math.min(240, Math.max(140, Math.round(winH * 0.20)));
        }
        var whyLightTrack = whyChooseSection ? whyChooseSection.querySelector('.why_travel_light_track') : null;

        function resetWhyChooseElements() {
            if (whyChooseSection) {
                whyChooseSection.style.transform = 'translate3d(100%, 0, 0)';
                whyChooseSection.style.visibility = 'hidden';
                whyChooseSection.classList.remove('in-view', 'spotlight-active', 'ray-active');
            }
            if (whyTitleStage) {
                var midY = getWhyHeaderCenterOffset();
                whyTitleStage.style.transform = 'translate3d(0, ' + midY + 'px, 0) scale(2.0)';
            }
            if (whyTitleOutline) {
                whyTitleOutline.style.opacity = '1';
                whyTitleOutline.style.backgroundPosition = '100% 0%';
            }
            if (whyTitleFill) {
                whyTitleFill.style.clipPath = 'inset(0 100% 0 0)';
                whyTitleFill.style.webkitClipPath = 'inset(0 100% 0 0)';
            }
            if (whySectionGlowBeam) {
                whySectionGlowBeam.style.opacity = '0';
                whySectionGlowBeam.style.left = '-30%';
            }
            if (whyHeader) {
                whyHeader.style.transform = 'translate3d(0, 0, 0)';
                whyHeader.style.opacity = '1';
            }
            if (whySubtitle) {
                whySubtitle.style.opacity = '1';
                whySubtitle.style.transform = 'none';
            }
            whySubtitleWords.forEach(function (w) {
                w.style.opacity = '0';
                w.style.transform = 'translate3d(0, 120%, 0) rotate(5deg)';
                w.style.filter = 'blur(6px)';
            });
            if (compareTableWrapper) {
                compareTableWrapper.style.transform = 'translate3d(0, 24px, 0)';
                compareTableWrapper.style.opacity = '0';
                compareTableWrapper.style.pointerEvents = 'none';
                compareTableWrapper.classList.remove('table-visible');
            }
            whyColumns.forEach(function (col) {
                col.style.transform = 'translate3d(0, 0, 0)';
                col.style.opacity = '1';
            });
            compareColHeaders.forEach(function (hdr) {
                hdr.style.transform = 'translate3d(0, 0, 0)';
                hdr.style.opacity = '1';
            });
            compareTableRows.forEach(function (rowElements) {
                rowElements.forEach(function (cell) {
                    cell.style.transform = 'translate3d(0, 0, 0)';
                    cell.style.opacity = '1';
                });
            });
            compareRowIcons.forEach(function (rowIcn) {
                rowIcn.forEach(function (icn) {
                    icn.style.transform = 'scale(1)';
                    icn.style.opacity = '1';
                });
            });
            if (whyLightTrack) {
                whyLightTrack.style.opacity = '';
            }
        }

        // Dog Design & Features Animated Cached Elements
        var dogSectionTitle = document.getElementById('dogSectionTitle');
        var dogPromptBar = document.getElementById('dogPromptBar');
        var dogPromptText = document.getElementById('dogPromptText');
        var dogPromptCursor = document.getElementById('dogPromptCursor');
        var dogPromptBtn = document.getElementById('dogPromptBtn');
        var dogTagWrap = document.getElementById('dogTagWrap');
        var dogTagCard = document.getElementById('dogTagCard');
        var dogTagSketchLayer = document.getElementById('dogTagSketchLayer');
        var dogTagColorLayer = document.getElementById('dogTagColorLayer');
        var dogColorSweepLine = document.getElementById('dogColorSweepLine');
        var dogSpecularShine = document.getElementById('dogSpecularShine');
        var dogFlyingArcToken = document.getElementById('dogFlyingArcToken');
        var dogFeaturesBar = document.getElementById('dogFeaturesBar');
        var dogFeaturesRail = document.getElementById('dogFeaturesRail');
        var dogRailActiveLine = document.getElementById('dogRailActiveLine');
        var dogTravelingToken = document.getElementById('dogTravelingToken');
        var dogFeatCols = dogFeaturesBar ? dogFeaturesBar.querySelectorAll('.dog_feat_col') : [];

        var dogAnimStarted = false;
        var dogAnimStep = 0;
        var dogTypeTimer = null;
        var dogAutoTimers = [];

        function spawnSparkleBurst(originX, originY) {
            var container = document.body;
            var count = 12;
            for (var i = 0; i < count; i++) {
                var spark = document.createElement('div');
                spark.className = 'dog_sparkle_particle';
                spark.style.position = 'fixed';
                spark.style.left = originX + 'px';
                spark.style.top = originY + 'px';
                spark.style.width = '6px';
                spark.style.height = '6px';
                spark.style.borderRadius = '50%';
                spark.style.pointerEvents = 'none';
                spark.style.zIndex = '9999';
                spark.style.background = 'radial-gradient(circle, #FFF0BA 20%, #E5BC64 70%, transparent 100%)';
                spark.style.boxShadow = '0 0 10px rgba(229, 188, 100, 0.9)';

                var angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
                var dist = 35 + Math.random() * 45;
                var destX = Math.cos(angle) * dist;
                var destY = Math.sin(angle) * dist;

                spark.style.transition = 'all 0.65s cubic-bezier(0.15, 0.9, 0.3, 1)';
                container.appendChild(spark);

                (function (s, dx, dy) {
                    requestAnimationFrame(function () {
                        s.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale(' + (0.3 + Math.random() * 0.7).toFixed(2) + ')';
                        s.style.opacity = '0';
                    });
                    setTimeout(function () {
                        if (s && s.parentNode) {
                            s.parentNode.removeChild(s);
                        }
                    }, 700);
                })(spark, destX, destY);
            }
        }

        function clearDogTimers() {
            if (dogTypeTimer) {
                clearTimeout(dogTypeTimer);
                dogTypeTimer = null;
            }
            dogAutoTimers.forEach(function (t) { clearTimeout(t); });
            dogAutoTimers = [];
        }

        function resetDogDesignAnimation() {
            clearDogTimers();
            dogAnimStarted = false;
            dogAnimStep = 0;

            if (dogSection) {
                dogSection.classList.remove('heading-animated');
            }
            if (dogPromptText) {
                dogPromptText.textContent = '';
            }
            if (dogPromptBtn) {
                dogPromptBtn.classList.remove('btn-active-click');
            }
            if (dogTagSketchLayer) {
                dogTagSketchLayer.style.opacity = '1';
            }
            if (dogTagColorLayer) {
                dogTagColorLayer.classList.remove('color-revealed');
            }
            if (dogFlyingArcToken) {
                dogFlyingArcToken.classList.remove('is-flying');
                dogFlyingArcToken.style.opacity = '0';
            }
            if (dogFeaturesBar) {
                dogFeaturesBar.classList.remove('bar-visible');
                dogFeaturesBar.style.opacity = '0';
                dogFeaturesBar.style.transform = 'translateY(32px)';
            }
            if (dogTravelingToken) {
                dogTravelingToken.classList.remove('token-visible');
                dogTravelingToken.style.left = '12.5%';
                dogTravelingToken.style.opacity = '0';
            }
            if (dogRailActiveLine) {
                dogRailActiveLine.setAttribute('x2', '50');
            }
            dogFeatCols.forEach(function (col) {
                col.classList.remove('step-active');
            });
        }

        function setRailStepDirect(stepNum, tokenLeft, railX2) {
            if (dogTravelingToken) {
                dogTravelingToken.classList.add('token-visible');
                dogTravelingToken.style.left = tokenLeft;
            }
            if (dogRailActiveLine) {
                dogRailActiveLine.setAttribute('x2', railX2.toString());
            }
            for (var s = 1; s <= 4; s++) {
                var col = document.getElementById('dogFeatCol' + s);
                if (col) {
                    if (s <= stepNum) {
                        col.classList.add('step-active');
                    } else {
                        col.classList.remove('step-active');
                    }
                }
            }
        }

        function startDogDesignSequence() {
            if (dogAnimStarted) return;
            dogAnimStarted = true;
            clearDogTimers();

            // 1. Heading reveals through sweeping gold blocks
            if (dogSection) {
                dogSection.classList.add('heading-animated');
            }

            // 2. Prompt types automatically & clicks "Generate Now"
            var promptPhrase = "A golden retriever in the mountains at sunset...";
            var charIdx = 0;
            if (dogPromptText) {
                dogPromptText.textContent = '';
                function typeChar() {
                    if (charIdx < promptPhrase.length) {
                        charIdx++;
                        dogPromptText.textContent = promptPhrase.substring(0, charIdx);
                        dogTypeTimer = setTimeout(typeChar, 22);
                    } else {
                        triggerGenerateClick();
                    }
                }
                dogAutoTimers.push(setTimeout(typeChar, 180));
            } else {
                dogAutoTimers.push(setTimeout(triggerGenerateClick, 600));
            }

            function triggerGenerateClick() {
                if (dogAnimStep >= 2) return;
                dogAnimStep = 2;

                if (dogPromptBtn) {
                    dogPromptBtn.classList.add('btn-active-click');
                    var rect = dogPromptBtn.getBoundingClientRect();
                    spawnSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

                    dogAutoTimers.push(setTimeout(function () {
                        dogPromptBtn.classList.remove('btn-active-click');
                    }, 240));
                }

                // Dog tag artwork draws as pencil sketch then fills with color
                if (dogTagColorLayer) {
                    dogTagColorLayer.classList.add('color-revealed');
                }
                if (dogTagSketchLayer) {
                    dogAutoTimers.push(setTimeout(function () {
                        dogTagSketchLayer.style.opacity = '0';
                    }, 350));
                }

                // Features bar rises into view
                dogAutoTimers.push(setTimeout(triggerFeaturesBarEntrance, 600));
            }

            function triggerFeaturesBarEntrance() {
                if (dogAnimStep >= 3) return;
                dogAnimStep = 3;

                if (dogFeaturesBar) {
                    dogFeaturesBar.classList.add('bar-visible');
                    dogFeaturesBar.style.opacity = '1';
                    dogFeaturesBar.style.transform = 'translateY(0)';
                }

                // Finished tag flies down in an arc and transforms into gold paw token
                if (dogFlyingArcToken) {
                    dogFlyingArcToken.classList.add('is-flying');
                }

                // Travels along dashed rail
                dogAutoTimers.push(setTimeout(triggerRailTravel, 750));
            }

            function triggerRailTravel() {
                if (dogAnimStep >= 4) return;
                dogAnimStep = 4;

                // Step 1
                setRailStepDirect(1, '12.5%', 160);

                // Step 2
                dogAutoTimers.push(setTimeout(function () {
                    setRailStepDirect(2, '37.5%', 380);
                }, 400));

                // Step 3
                dogAutoTimers.push(setTimeout(function () {
                    setRailStepDirect(3, '62.5%', 620);
                }, 800));

                // Step 4
                dogAutoTimers.push(setTimeout(function () {
                    setRailStepDirect(4, '87.5%', 860);
                    if (dogTravelingToken) {
                        var rect = dogTravelingToken.getBoundingClientRect();
                        spawnSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }
                }, 1200));
            }
        }

        var targetProgress = 0; // Range: 0.0 to 13.0
        // 0-1: Profile in from right (3.4s)
        // 1-2: Product in from right (3.4s)
        // 2-3: Product dwell (3.0s)
        // 3-7: Why Choose cinematic sequence (slide in -> heading reveal -> move up -> para reveal -> table fade in)
        // 7-8: Why Choose columns part like window -> Dog Section appears from middle (3.4s)
        // 8-9: Synchronized Dog Design & Features Showcase (fast, engaging, short scroll)
        // 9-10: More Pets section appears from bottom like a parallax (3.4s)
        // 10-11: Scroll for 2.0s on More Pets section (dwell)
        // 11-12: FAQ section appears from bottom like a parallax (takes 2-3 scrolls)
        // 12-13: Footer section appears from bottom (takes 2 scrolls)
        var currentProgress = 0;
        var profileRevealed = false;
        var rafId = null;
        var handTimer = null;
        var arrowTimer = null;
        var stage1IdleTimer = null;
        var lastStage1ScrollTime = 0;
        var stage2IdleTimer = null;
        var lastStage2ScrollTime = 0;
        var stage3IdleTimer = null;
        var lastStage3ScrollTime = 0;
        var lastMorePetsScrollTime = 0;
        var lastFaqScrollTime = 0;

        // Scroll deltas per stage
        var stage1Delta = 600;          // Choose -> Profile (Fast, fluid, automatic slide-in)
        var stage2Delta = 3400;         // Profile -> Product (3.4s)
        var productDwellDelta = 3000;   // Scroll for 3 SECONDS on the Product section!
        var whyChooseTotalDelta = 3500; // Why Choose complete sequence (smooth, no scrolling for seconds)
        var dogSectionDelta = 2000;     // Dog Section appears from middle of comparison columns
        var dogDwellDelta = 800;        // Fast, smooth, engaging scroll on Dog Section!
        var morePetsDelta = 900;        // More Pets section appears from bottom like a parallax
        var morePetsDwellDelta = 300;   // Dwell on More Pets section
        var faqDelta = 400;             // FAQ section appears from bottom (takes 2-3 scrolls)

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function renderScrollProgress() {
            var lerpFactor = (targetProgress <= 3.0 || currentProgress <= 3.0) ? 0.055 : 0.10;
            currentProgress = lerp(currentProgress, targetProgress, lerpFactor);

            if (Math.abs(currentProgress - targetProgress) < 0.002) {
                currentProgress = targetProgress;
            }

            if (currentProgress <= 1.0) {
                // ========================================== 
                // STAGE 1: CHOOSE -> PROFILE SECTION (0.0 to 1.0)
                // ========================================== 
                var p1 = Math.min(1, Math.max(0, currentProgress));

                if (chooseSection) {
                    var chooseScale = 1 - (p1 * 0.045);
                    var chooseOpacity = Math.max(0, 1 - (p1 * 0.40));
                    var chooseBrightness = 1 - (p1 * 0.16);
                    var chooseBlur = p1 * 2.5;
                    chooseSection.style.transform = 'translate3d(0, 0, 0) scale(' + chooseScale.toFixed(4) + ')';
                    chooseSection.style.opacity = chooseOpacity.toFixed(3);
                    chooseSection.style.filter = 'brightness(' + chooseBrightness.toFixed(3) + ') blur(' + chooseBlur.toFixed(2) + 'px)';
                    chooseSection.style.visibility = (p1 < 0.99) ? 'visible' : 'hidden';
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
                    productSection.style.clipPath = 'none';
                    productSection.style.webkitClipPath = 'none';
                    productSection.style.transform = 'translate3d(100%, 0, 0)';
                    productSection.style.opacity = '1';
                    productSection.style.visibility = 'hidden';
                }
                duoCards.forEach(function (c) {
                    c.classList.remove('in-view');
                    c.style.transform = '';
                    c.style.opacity = '';
                });

                resetWhyChooseElements();

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
                if (footerSection) {
                    footerSection.style.transform = 'translate3d(0, 100%, 0)';
                    footerSection.style.opacity = '0';
                    footerSection.style.visibility = 'hidden';
                }

            } else if (currentProgress <= 2.0) {
                // ========================================== 
                // STAGE 2: PROFILE -> PRODUCT SECTION (1.0 to 2.0)
                // Appears smoothly sliding in from the right side!
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
                    var prodX = (1 - p2) * 100;
                    productSection.style.clipPath = 'none';
                    productSection.style.webkitClipPath = 'none';
                    productSection.style.transform = 'translate3d(' + prodX.toFixed(3) + '%, 0, 0)';
                    productSection.style.opacity = '1';
                    productSection.style.visibility = (p2 > 0.005) ? 'visible' : 'hidden';
                }

                if (duoCards.length >= 2) {
                    var cardOffset1 = (1 - p2) * 20;
                    var cardOffset2 = (1 - p2) * 45;
                    if (p2 >= 0.99) {
                        duoCards[0].style.transform = '';
                        duoCards[1].style.transform = '';
                    } else {
                        duoCards[0].style.transform = 'translate3d(' + cardOffset1.toFixed(1) + 'px, 0, 0)';
                        duoCards[1].style.transform = 'translate3d(' + cardOffset2.toFixed(1) + 'px, 0, 0)';
                    }

                    if (p2 > 0.25) {
                        duoCards[0].classList.add('in-view');
                        duoCards[1].classList.add('in-view');
                    } else {
                        duoCards[0].classList.remove('in-view');
                        duoCards[1].classList.remove('in-view');
                    }
                }

                resetWhyChooseElements();

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
                // STAGE 3: PRODUCT DUO -> WHY CHOOSE SLIDE-IN (2.0 to 3.0)
                // Why Choose slides in slowly & smoothly from the right in 2 scrolls!
                // ========================================== 
                var p3 = Math.min(1, Math.max(0, currentProgress - 2.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.filter = 'brightness(0.82) blur(2.5px)';
                profileSection.style.opacity = '0.75';

                // Duo section dims and scales down slightly as Why Choose slides in
                if (productSection) {
                    var prodScale = 1.0 - (p3 * 0.06);       // 1.0 -> 0.94
                    var prodBrightness = 1.0 - (p3 * 0.28);  // 1.0 -> 0.72
                    var prodOpacity = 1.0 - (p3 * 0.20);     // 1.0 -> 0.80
                    productSection.style.clipPath = 'none';
                    productSection.style.webkitClipPath = 'none';
                    productSection.style.transform = 'scale(' + prodScale.toFixed(3) + ')';
                    productSection.style.filter = 'brightness(' + prodBrightness.toFixed(3) + ')';
                    productSection.style.opacity = prodOpacity.toFixed(3);
                    productSection.style.visibility = (p3 < 0.98) ? 'visible' : 'hidden';
                }
                duoCards.forEach(function (c) {
                    c.classList.add('in-view');
                    c.style.transform = '';
                });

                if (whyChooseSection) {
                    var whyX = (1 - p3) * 100;
                    whyChooseSection.style.transform = 'translate3d(' + whyX.toFixed(3) + '%, 0, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = (p3 > 0.005) ? 'visible' : 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }

                // Heading starts centered, large (2x), outline-only ready for ray sweep
                if (whyTitleStage) {
                    var midY = getWhyHeaderCenterOffset();
                    whyTitleStage.style.transform = 'translate3d(0, ' + midY + 'px, 0) scale(2.0)';
                }
                if (whyTitleOutline) {
                    whyTitleOutline.style.opacity = '1';
                    whyTitleOutline.style.backgroundPosition = '100% 0%';
                }
                if (whyTitleFill) {
                    whyTitleFill.style.clipPath = 'inset(0 100% 0 0)';
                    whyTitleFill.style.webkitClipPath = 'inset(0 100% 0 0)';
                }
                if (whySectionGlowBeam) {
                    whySectionGlowBeam.style.opacity = '0';
                    whySectionGlowBeam.style.left = '-30%';
                }
                if (whySubtitle) {
                    whySubtitle.style.opacity = '1';
                    whySubtitle.style.transform = 'none';
                }
                whySubtitleWords.forEach(function (w) {
                    w.style.opacity = '0';
                    w.style.transform = 'translate3d(0, 120%, 0) rotate(5deg)';
                    w.style.filter = 'blur(6px)';
                });
                if (compareTableWrapper) {
                    compareTableWrapper.classList.remove('table-visible');
                    compareTableWrapper.style.opacity = '0';
                    compareTableWrapper.style.transform = 'translate3d(0, 24px, 0)';
                    compareTableWrapper.style.pointerEvents = 'none';
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

            } else if (currentProgress <= 7.0) {
                // ========================================== 
                // STAGES 4-7: CINEMATIC 5-STAGE WHY CHOOSE SEQUENCE (3.0 to 7.0)
                // 1. 0-20%: Section slides in slowly from right (translateX 100% -> 0), duo scales down & dims
                // 2. 24-46%: Heading appears large (2x) in center, outline-only, ray sweeps left to right,
                //            soft glow beam crosses section, fill layer revealed with clip-path
                // 3. 52-64%: Heading scales down (2x -> 1x) & moves to normal position, outline layer fades out
                // 4. 62-76%: Paragraph reveals word by word rising from mask with rotation & clearing blur
                // 5. 74-96%: Table columns fade up staggered, headers slide up, cells row by row, check/cross icons scale in
                // ========================================== 
                var whyProgress = Math.min(1, Math.max(0, (currentProgress - 3.0) / 4.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.filter = 'brightness(0.82) blur(2.5px)';
                profileSection.style.opacity = '0.75';

                // ------------------------------------------
                // 1. WHY CHOOSE RESTS CENTERED & DUO HIDDEN
                // ------------------------------------------
                if (productSection) {
                    productSection.style.visibility = 'hidden';
                }

                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 0, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = 'visible';

                    if (whyProgress >= 0.76) {
                        whyChooseSection.classList.add('in-view', 'spotlight-active');
                    } else {
                        whyChooseSection.classList.remove('in-view', 'spotlight-active');
                    }
                }

                // ------------------------------------------
                // 2 & 3. 24-46% & 52-64%: HEADING (CENTER 2X, RAY SWEEP, CLIP-PATH FILL, SETTLE UP)
                // ------------------------------------------
                var midY = getWhyHeaderCenterOffset();

                if (whyTitleStage) {
                    if (whyProgress < 0.52) {
                        // Centered and large (2x)
                        whyTitleStage.style.transform = 'translate3d(0, ' + midY + 'px, 0) scale(2.0)';
                    } else if (whyProgress <= 0.64) {
                        // 52-64%: Scales down from 2.0 -> 1.0 and moves from midY -> 0
                        var p3 = (whyProgress - 0.52) / (0.64 - 0.52);
                        var eased3 = p3 * (2 - p3);
                        var curHdrY = (1 - eased3) * midY;
                        var curScale = 2.0 - (eased3 * 1.0);
                        whyTitleStage.style.transform = 'translate3d(0, ' + curHdrY.toFixed(2) + 'px, 0) scale(' + curScale.toFixed(3) + ')';
                    } else {
                        // Normal settled position
                        whyTitleStage.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    }
                }

                // Fill layer revealed with clip-path behind ray
                if (whyTitleFill) {
                    if (whyProgress < 0.24) {
                        whyTitleFill.style.clipPath = 'inset(0 100% 0 0)';
                        whyTitleFill.style.webkitClipPath = 'inset(0 100% 0 0)';
                    } else if (whyProgress <= 0.46) {
                        var p2 = (whyProgress - 0.24) / (0.46 - 0.24);
                        var fillInsetRight = Math.max(0, (1 - p2) * 100);
                        whyTitleFill.style.clipPath = 'inset(0 ' + fillInsetRight.toFixed(1) + '% 0 0)';
                        whyTitleFill.style.webkitClipPath = 'inset(0 ' + fillInsetRight.toFixed(1) + '% 0 0)';
                    } else {
                        whyTitleFill.style.clipPath = 'inset(0 0% 0 0)';
                        whyTitleFill.style.webkitClipPath = 'inset(0 0% 0 0)';
                    }
                }

                // Outline layer: outline-only, ray sweeps left to right during 24-46%, fades out 52-64%
                if (whyTitleOutline) {
                    if (whyProgress < 0.24) {
                        whyTitleOutline.style.opacity = '1';
                        whyTitleOutline.style.backgroundPosition = '100% 0%';
                    } else if (whyProgress <= 0.46) {
                        var p2Ray = (whyProgress - 0.24) / (0.46 - 0.24);
                        var rayPos = 100 - (p2Ray * 200); // 100% -> -100%
                        whyTitleOutline.style.backgroundPosition = rayPos.toFixed(1) + '% 0%';
                        whyTitleOutline.style.opacity = '1';
                    } else if (whyProgress < 0.52) {
                        whyTitleOutline.style.opacity = '1';
                        whyTitleOutline.style.backgroundPosition = '-100% 0%';
                    } else if (whyProgress <= 0.64) {
                        var p3Out = (whyProgress - 0.52) / (0.64 - 0.52);
                        whyTitleOutline.style.opacity = Math.max(0, 1 - p3Out).toFixed(3);
                    } else {
                        whyTitleOutline.style.opacity = '0';
                    }
                }

                // Soft glow beam crossing the section during 24-46%
                if (whySectionGlowBeam) {
                    if (whyProgress >= 0.24 && whyProgress <= 0.46) {
                        var p2Beam = (whyProgress - 0.24) / (0.46 - 0.24);
                        var beamX = -30 + (p2Beam * 140);
                        var beamOp = Math.sin(p2Beam * Math.PI) * 0.85;
                        whySectionGlowBeam.style.left = beamX.toFixed(1) + '%';
                        whySectionGlowBeam.style.opacity = beamOp.toFixed(3);
                    } else {
                        whySectionGlowBeam.style.opacity = '0';
                    }
                }

                if (whyHeader) {
                    whyHeader.style.transform = 'translate3d(0, 0, 0)';
                    whyHeader.style.opacity = '1';
                }

                // ------------------------------------------
                // 4. 62-76%: SUBTITLE WORD-BY-WORD REVEAL (RISING, ROTATION, UNBLUR)
                // ------------------------------------------
                if (whySubtitle) {
                    whySubtitle.style.opacity = '1';
                    whySubtitle.style.transform = 'none';
                }
                var totalWords = whySubtitleWords.length;
                if (whyProgress < 0.62) {
                    whySubtitleWords.forEach(function (w) {
                        w.style.opacity = '0';
                        w.style.transform = 'translate3d(0, 120%, 0) rotate(5deg)';
                        w.style.filter = 'blur(6px)';
                    });
                } else if (whyProgress <= 0.76) {
                    var p4 = (whyProgress - 0.62) / (0.76 - 0.62);
                    for (var i = 0; i < totalWords; i++) {
                        var wordStart = (i / totalWords) * 0.60;
                        var wordLen = 0.40;
                        var wP = Math.min(1, Math.max(0, (p4 - wordStart) / wordLen));
                        var easedW = wP * (2 - wP);
                        var wY = (1 - easedW) * 120;
                        var wRot = (1 - easedW) * 5.0;
                        var wBlur = (1 - easedW) * 6.0;
                        whySubtitleWords[i].style.transform = 'translate3d(0, ' + wY.toFixed(1) + '%, 0) rotate(' + wRot.toFixed(2) + 'deg)';
                        whySubtitleWords[i].style.opacity = easedW.toFixed(3);
                        whySubtitleWords[i].style.filter = (wBlur > 0.08) ? 'blur(' + wBlur.toFixed(1) + 'px)' : 'none';
                    }
                } else {
                    whySubtitleWords.forEach(function (w) {
                        w.style.opacity = '1';
                        w.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
                        w.style.filter = 'none';
                    });
                }

                // ------------------------------------------
                // 5. COMPARE TABLE WRAPPER FADE ANIMATION (AFTER PARA FULLY APPEARS)
                // ------------------------------------------
                if (compareTableWrapper) {
                    if (whyProgress < 0.76) {
                        compareTableWrapper.classList.remove('table-visible');
                        compareTableWrapper.style.opacity = '0';
                        compareTableWrapper.style.transform = 'translate3d(0, 24px, 0)';
                        compareTableWrapper.style.pointerEvents = 'none';
                    } else {
                        compareTableWrapper.classList.add('table-visible');
                        compareTableWrapper.style.opacity = '1';
                        compareTableWrapper.style.transform = 'translate3d(0, 0, 0)';
                        compareTableWrapper.style.pointerEvents = 'auto';
                    }
                }

                // All columns, headers, rows, and icons remain fully ready and visible
                whyColumns.forEach(function (col) {
                    col.style.transform = 'translate3d(0, 0, 0)';
                    col.style.opacity = '1';
                });
                compareColHeaders.forEach(function (hdr) {
                    hdr.style.transform = 'translate3d(0, 0, 0)';
                    hdr.style.opacity = '1';
                });
                compareTableRows.forEach(function (rowElements) {
                    rowElements.forEach(function (cell) {
                        cell.style.transform = 'translate3d(0, 0, 0)';
                        cell.style.opacity = '1';
                    });
                });
                compareRowIcons.forEach(function (rowIcn) {
                    rowIcn.forEach(function (icn) {
                        icn.style.transform = 'scale(1)';
                        icn.style.opacity = '1';
                    });
                });

                if (whyLightTrack) {
                    whyLightTrack.style.opacity = (whyProgress >= 0.76) ? '1' : '0';
                }

                // Reset following sections (Dog, More Pets, FAQ)
                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 0, 0)';
                    whyChooseSection.style.filter = '';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = 'visible';
                }
                if (dogSection) {
                    dogSection.style.clipPath = 'none';
                    dogSection.style.webkitClipPath = 'none';
                    dogSection.style.zIndex = '50';
                    dogSection.style.transform = 'translate3d(0, 100%, 0)';
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
            } else if (currentProgress <= 8.0) {
                // ========================================== 
                // STAGE 8: PARALLAX TRANSITION - DOG DESIGN SECTION APPEARS FROM BOTTOM! (7.0 to 8.0)
                // As user scrolls, Why Choose section smoothly translates up & scales back (parallax background),
                // while Dog Design section rises up from bottom into full view!
                // ========================================== 
                var p8 = Math.min(1, Math.max(0, currentProgress - 7.0));

                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                }

                profileSection.style.transform = 'scale(0.92)';
                profileSection.style.opacity = '0.75';

                // Previous Section: Why Choose Section smoothly parallaxes upward and recedes
                if (whyChooseSection) {
                    var whyParallaxY = -p8 * 25;
                    var whyParallaxScale = 1 - (p8 * 0.05);
                    var whyParallaxOpacity = Math.max(0, 1 - (p8 * 0.6));
                    whyChooseSection.style.transform = 'translate3d(0, ' + whyParallaxY.toFixed(2) + '%, 0) scale(' + whyParallaxScale.toFixed(3) + ')';
                    whyChooseSection.style.filter = '';
                    whyChooseSection.style.opacity = whyParallaxOpacity.toFixed(3);
                    whyChooseSection.style.visibility = (p8 < 0.99) ? 'visible' : 'hidden';
                    whyChooseSection.style.zIndex = '35';
                }

                // Incoming Section: Dog Design Section appears from bottom like a parallax!
                if (dogSection) {
                    dogSection.style.clipPath = 'none';
                    dogSection.style.webkitClipPath = 'none';
                    dogSection.style.zIndex = '50';

                    var dogY = (1 - p8) * 100;
                    dogSection.style.transform = 'translate3d(0, ' + dogY.toFixed(2) + '%, 0)';
                    dogSection.style.opacity = Math.min(1, p8 * 1.6).toFixed(3);
                    dogSection.style.filter = '';
                    dogSection.style.visibility = (p8 > 0.005) ? 'visible' : 'hidden';

                    if (p8 >= 0.80) {
                        if (!dogSection.classList.contains('dog-animated')) {
                            dogSection.classList.add('dog-animated');
                        }
                    } else if (p8 < 0.60) {
                        dogSection.classList.remove('dog-animated');
                        resetDogDesignAnimation();
                    }

                    if (p8 >= 0.99) {
                        dogSection.style.transform = 'translate3d(0, 0%, 0)';
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

            } else if (currentProgress <= 9.0) {
                // ========================================== 
                // STAGE 9: SYNCHRONIZED DOG DESIGN & FEATURES SEQUENCE (8.0 to 9.0)
                // - Sweeping gold blocks reveal heading
                // - Prompt types automatically & clicks "Generate Now"
                // - Dog tag artwork draws as pencil sketch then fills with color
                // - Features bar rises into view
                // - Finished tag flies down in an arc, transforms into gold paw token
                // - Travels along dashed rail across steps 1 -> 2 -> 3 -> 4
                // ========================================== 
                var p9 = Math.min(1, Math.max(0, currentProgress - 8.0));

                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }
                if (dogSection) {
                    dogSection.style.clipPath = 'none';
                    dogSection.style.webkitClipPath = 'none';
                    dogSection.style.zIndex = '50';
                    dogSection.style.transform = 'translate3d(0, 0%, 0)';
                    dogSection.style.opacity = '1';
                    dogSection.style.visibility = 'visible';
                    if (!dogSection.classList.contains('dog-animated')) {
                        dogSection.classList.add('dog-animated');
                    }
                }

                // Trigger sequence immediately on stage entry
                if (p9 >= 0.05) {
                    startDogDesignSequence();
                }

                // If user scrolls forward, synchronize rail step directly with scroll progression
                if (dogAnimStep >= 3) {
                    if (p9 >= 0.82) {
                        setRailStepDirect(4, '87.5%', 860);
                    } else if (p9 >= 0.60) {
                        setRailStepDirect(3, '62.5%', 620);
                    } else if (p9 >= 0.38) {
                        setRailStepDirect(2, '37.5%', 380);
                    } else if (p9 >= 0.16) {
                        setRailStepDirect(1, '12.5%', 160);
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

            } else if (currentProgress <= 10.0) {
                // ========================================== 
                // STAGE 10: AFTER SCROLL ON DOG SECTION,
                // MORE PETS SECTION APPEARS FROM BOTTOM LIKE A PARALLAX! (9.0 to 10.0)
                // ========================================== 
                var p10 = Math.min(1, Math.max(0, currentProgress - 9.0));

                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }

                if (dogSection) {
                    var dogParallaxY = -p10 * 28;
                    var dogParallaxScale = 1 - (p10 * 0.05);
                    var dogParallaxOpacity = Math.max(0, 1 - (p10 * 0.5));
                    dogSection.style.transform = 'translate3d(0, ' + dogParallaxY.toFixed(2) + '%, 0) scale(' + dogParallaxScale.toFixed(3) + ')';
                    dogSection.style.opacity = dogParallaxOpacity.toFixed(3);
                    dogSection.style.visibility = (p10 < 0.99) ? 'visible' : 'hidden';

                    dogSection.classList.add('dog-animated', 'heading-animated');
                    if (dogTagColorLayer) dogTagColorLayer.classList.add('color-revealed');
                    if (dogFeaturesBar) {
                        dogFeaturesBar.classList.add('bar-visible');
                        dogFeaturesBar.style.opacity = '1';
                        dogFeaturesBar.style.transform = 'translateY(0)';
                    }
                    setRailStepDirect(4, '87.5%', 860);
                }

                if (morePetsSection) {
                    var morePetsY = (1 - p10) * 100;
                    morePetsSection.style.transform = 'translate3d(0, ' + morePetsY.toFixed(2) + '%, 0)';
                    morePetsSection.style.opacity = Math.min(1, p10 * 1.6).toFixed(3);
                    morePetsSection.style.visibility = (p10 > 0.005) ? 'visible' : 'hidden';

                    if (p10 >= 0.85) {
                        if (!morePetsSection.classList.contains('pets-animated')) {
                            morePetsSection.classList.add('pets-animated');
                        }
                    } else if (p10 < 0.60) {
                        morePetsSection.classList.remove('pets-animated');
                    }

                    if (p10 >= 0.99) {
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

            } else if (currentProgress <= 11.0) {
                // ========================================== 
                // STAGE 11: SCROLL FOR 2.0 SECONDS ON MORE PETS SECTION! (10.0 to 11.0)
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
                if (footerSection) {
                    footerSection.style.transform = 'translate3d(0, 100%, 0)';
                    footerSection.style.opacity = '0';
                    footerSection.style.visibility = 'hidden';
                }

            } else if (currentProgress <= 12.0) {
                // ========================================== 
                // STAGE 12: FAQ SECTION APPEARS FROM BOTTOM LIKE A PARALLAX! (11.0 to 12.0)
                // ========================================== 
                var p12 = Math.min(1, Math.max(0, currentProgress - 11.0));

                if (whyChooseSection) {
                    whyChooseSection.style.opacity = '0';
                    whyChooseSection.style.visibility = 'hidden';
                }
                if (dogSection) {
                    dogSection.style.opacity = '0';
                    dogSection.style.visibility = 'hidden';
                }

                if (morePetsSection) {
                    var morePetsParallaxY = -p12 * 25;
                    var morePetsParallaxScale = 1 - (p12 * 0.04);
                    var morePetsParallaxOpacity = Math.max(0, 1 - (p12 * 0.5));
                    morePetsSection.style.transform = 'translate3d(0, ' + morePetsParallaxY.toFixed(2) + '%, 0) scale(' + morePetsParallaxScale.toFixed(3) + ')';
                    morePetsSection.style.opacity = morePetsParallaxOpacity.toFixed(3);
                    morePetsSection.style.visibility = (p12 < 0.99) ? 'visible' : 'hidden';
                }

                if (faqSection) {
                    var faqY = (1 - p12) * 100;
                    faqSection.style.transform = 'translate3d(0, ' + faqY.toFixed(2) + '%, 0)';
                    faqSection.style.opacity = Math.min(1, p12 * 1.6).toFixed(3);
                    faqSection.style.visibility = (p12 > 0.005) ? 'visible' : 'hidden';

                    if (p12 >= 0.30) {
                        if (!faqEntrancePlayed) {
                            faqEntrancePlayed = true;
                            faqSection.classList.add('faq-entered');
                        }
                    } else if (p12 < 0.15) {
                        faqSection.classList.remove('faq-entered');
                        faqEntrancePlayed = false;
                        resetFaqAnimation();
                    }

                    if (p12 >= 0.99) {
                        faqSection.style.transform = 'translate3d(0, 0%, 0)';
                        faqSection.style.opacity = '1';
                    }

                    if (typeof onFaqScrollOrUpdate === 'function') {
                        onFaqScrollOrUpdate();
                    }
                }

                if (footerSection) {
                    footerSection.style.transform = 'translate3d(0, 100%, 0)';
                    footerSection.style.opacity = '0';
                    footerSection.style.visibility = 'hidden';
                }

            } else {
                // ========================================== 
                // STAGE 13: FOOTER SECTION APPEARS FROM BOTTOM (12.0 to 13.0)
                // ========================================== 
                var p13 = Math.min(1, Math.max(0, currentProgress - 12.0));

                if (morePetsSection) {
                    morePetsSection.style.opacity = '0';
                    morePetsSection.style.visibility = 'hidden';
                }

                if (faqSection) {
                    var faqParallaxY = -p13 * 25;
                    var faqParallaxScale = 1 - (p13 * 0.04);
                    var faqParallaxOpacity = Math.max(0, 1 - (p13 * 0.5));
                    faqSection.style.transform = 'translate3d(0, ' + faqParallaxY.toFixed(2) + '%, 0) scale(' + faqParallaxScale.toFixed(3) + ')';
                    faqSection.style.opacity = faqParallaxOpacity.toFixed(3);
                    faqSection.style.visibility = (p13 < 0.99) ? 'visible' : 'hidden';
                }

                if (footerSection) {
                    var footerY = (1 - p13) * 100;
                    footerSection.style.transform = 'translate3d(0, ' + footerY.toFixed(2) + '%, 0)';
                    footerSection.style.opacity = Math.min(1, p13 * 1.6).toFixed(3);
                    footerSection.style.visibility = (p13 > 0.005) ? 'visible' : 'hidden';

                    if (p13 >= 0.99) {
                        footerSection.style.transform = 'translate3d(0, 0%, 0)';
                        footerSection.style.opacity = '1';
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
            if (stage1IdleTimer) {
                clearTimeout(stage1IdleTimer);
                stage1IdleTimer = null;
            }
            if (stage2IdleTimer) {
                clearTimeout(stage2IdleTimer);
                stage2IdleTimer = null;
            }
            if (stage3IdleTimer) {
                clearTimeout(stage3IdleTimer);
                stage3IdleTimer = null;
            }
            profileSection.classList.remove('slide-in', 'hand-revealed', 'arrow-drawn', 'in-view');
            profileSection.style.transform = 'translate3d(100%, 0, 0)';
            profileSection.style.opacity = '1';
            profileSection.style.filter = '';
            profileSection.style.visibility = 'hidden';
            if (chooseSection) {
                chooseSection.style.transform = 'translate3d(0, 0, 0)';
                chooseSection.style.opacity = '1';
                chooseSection.style.filter = '';
                chooseSection.style.visibility = 'visible';
                chooseSection.classList.add('in-view');
            }
            if (productSection) {
                productSection.style.clipPath = 'none';
                productSection.style.webkitClipPath = 'none';
                productSection.style.transform = 'translate3d(100%, 0, 0)';
                productSection.style.opacity = '1';
                productSection.style.visibility = 'hidden';
            }
            duoCards.forEach(function (c) {
                c.classList.remove('in-view');
                c.style.transform = '';
                c.style.opacity = '';
            });
            resetWhyChooseElements();

            if (dogSection) {
                dogSection.style.clipPath = 'none';
                dogSection.style.webkitClipPath = 'none';
                dogSection.style.zIndex = '50';
                dogSection.style.transform = 'translate3d(0, 100%, 0)';
                dogSection.style.opacity = '0';
                dogSection.style.visibility = 'hidden';
                dogSection.classList.remove('dog-animated');
                resetDogDesignAnimation();
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
        // Active mouse wheel scroll handler (bidirectional 12-stage navigation)
        window.addEventListener('wheel', function (e) {
            if (window.innerWidth <= 991) return;

            var rect = wrapper.getBoundingClientRect();
            // Is pinned container active in viewport?
            var isInsidePin = (rect.top <= 60 || targetProgress > 0) && (rect.bottom > 120);
            if (!isInsidePin) return;

            if (e.deltaY > 0) {
                // User scrolling DOWN:
                if (targetProgress < 1.0) {
                    // Stage 1: Choose -> Profile (Takes 2 scrolls to bring Profile section into view, slowly & smoothly)
                    var now = Date.now();
                    if (stage1IdleTimer) clearTimeout(stage1IdleTimer);

                    if (targetProgress < 0.45) {
                        // Scroll 1: Start sliding in halfway (slowly & smoothly)
                        targetProgress = 0.50;
                        lastStage1ScrollTime = now;
                        wakeRender();
                        stage1IdleTimer = setTimeout(function () {
                            if (targetProgress === 0.50) {
                                targetProgress = 0.0;
                                wakeRender();
                            }
                        }, 2500);
                    } else if (now - lastStage1ScrollTime > 160) {
                        // Scroll 2: Distinct second scroll completes the slide-in to center
                        targetProgress = 1.0;
                        wakeRender();
                    }
                } else if (targetProgress >= 1.0 && targetProgress < 2.0) {
                    // Stage 2: Profile -> Product Duo (Takes 2 scrolls on Profile section to bring Product section in, slowly & smoothly)
                    if (currentProgress >= 0.94) {
                        var nowStage2 = Date.now();
                        if (stage2IdleTimer) clearTimeout(stage2IdleTimer);

                        if (targetProgress < 1.45) {
                            // Scroll 1: Start sliding in halfway from right (slowly & smoothly)
                            targetProgress = 1.50;
                            lastStage2ScrollTime = nowStage2;
                            wakeRender();
                            stage2IdleTimer = setTimeout(function () {
                                if (targetProgress === 1.50) {
                                    targetProgress = 1.0;
                                    wakeRender();
                                }
                            }, 2500);
                        } else if (nowStage2 - lastStage2ScrollTime > 160) {
                            // Scroll 2: Distinct second scroll completes the slide-in to center
                            targetProgress = 2.0;
                            wakeRender();
                        }
                    }
                } else if (targetProgress >= 2.0 && targetProgress < 3.0) {
                    // Stage 3: Product Duo -> Why Choose (Takes 2 scrolls on Product section to bring Why Choose section in, slowly & smoothly)
                    if (currentProgress >= 1.94) {
                        var nowStage3 = Date.now();
                        if (stage3IdleTimer) clearTimeout(stage3IdleTimer);

                        if (targetProgress < 2.45) {
                            // Scroll 1: Start sliding in halfway from right (slowly & smoothly)
                            targetProgress = 2.50;
                            lastStage3ScrollTime = nowStage3;
                            wakeRender();
                            stage3IdleTimer = setTimeout(function () {
                                if (targetProgress === 2.50) {
                                    targetProgress = 2.0;
                                    wakeRender();
                                }
                            }, 2500);
                        } else if (nowStage3 - lastStage3ScrollTime > 160) {
                            // Scroll 2: Distinct second scroll completes the slide-in to center
                            targetProgress = 3.0;
                            wakeRender();
                        }
                    }
                } else if (targetProgress >= 3.0 && targetProgress < 7.0) {
                    // Stages 4-7: Why Choose cinematic 5-stage scroll sequence (3.0 to 7.0)
                    if (currentProgress >= 2.96) {
                        targetProgress = Math.min(7.0, targetProgress + (e.deltaY / whyChooseTotalDelta) * 4.0);
                        wakeRender();
                    }
                } else if (targetProgress >= 7.0 && targetProgress < 8.0) {
                    // Stage 8: Dog Section appears from bottom like a parallax!
                    if (currentProgress >= 6.96) {
                        targetProgress = Math.min(8.0, targetProgress + (e.deltaY / dogSectionDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 8.0 && targetProgress < 9.0) {
                    // Stage 9: Scroll for 2.0 SECONDS on the Dog section!
                    if (currentProgress >= 7.96) {
                        targetProgress = Math.min(9.0, targetProgress + (e.deltaY / dogDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 9.0 && targetProgress < 10.0) {
                    // Stage 10: More Pets section appears from bottom like a parallax! (3.4s scroll)
                    if (currentProgress >= 8.96) {
                        targetProgress = Math.min(10.0, targetProgress + (e.deltaY / morePetsDelta));
                        wakeRender();
                    }
                } else if (targetProgress >= 10.0 && targetProgress < 12.0) {
                    // Stage 11 & 12: More Pets -> FAQ section (Takes 2-3 scrolls on More Pets section to bring FAQ in)
                    if (currentProgress >= 9.92) {
                        var nowMorePets = Date.now();
                        var timeSinceLastMorePets = nowMorePets - lastMorePetsScrollTime;

                        if (targetProgress < 11.35) {
                            // Scroll 1: Start bringing FAQ section in (~45% in from bottom)
                            if (currentProgress < 10.95) currentProgress = 10.95;
                            targetProgress = 11.45;
                            lastMorePetsScrollTime = nowMorePets;
                            wakeRender();
                        } else if (targetProgress < 11.80 && timeSinceLastMorePets > 130) {
                            // Scroll 2: Advance FAQ section (~80% in)
                            targetProgress = 11.80;
                            lastMorePetsScrollTime = nowMorePets;
                            wakeRender();
                        } else if (timeSinceLastMorePets > 130) {
                            // Scroll 3: Distinct scroll locks FAQ section in at 100%
                            targetProgress = 12.0;
                            lastMorePetsScrollTime = nowMorePets;
                            wakeRender();
                        } else {
                            // Continuous / trackpad scroll
                            targetProgress = Math.min(12.0, targetProgress + (Math.abs(e.deltaY) / 350));
                            wakeRender();
                        }
                    }
                } else if (targetProgress >= 12.0 && targetProgress < 13.0) {
                    // Stage 13: FAQ section -> Footer (Takes 2 scrolls on FAQ section to bring Footer in)
                    if (currentProgress >= 11.92) {
                        var nowFaq = Date.now();
                        var timeSinceLastFaq = nowFaq - lastFaqScrollTime;

                        if (targetProgress < 12.45) {
                            // Scroll 1: Start bringing Footer in (~50% in from bottom)
                            if (currentProgress < 11.95) currentProgress = 12.0;
                            targetProgress = 12.50;
                            lastFaqScrollTime = nowFaq;
                            wakeRender();
                        } else if (timeSinceLastFaq > 130) {
                            // Scroll 2: Distinct scroll locks Footer section at 100%
                            targetProgress = 13.0;
                            lastFaqScrollTime = nowFaq;
                            wakeRender();
                        } else {
                            targetProgress = Math.min(13.0, targetProgress + (Math.abs(e.deltaY) / 350));
                            wakeRender();
                        }
                    }
                }
            } else if (e.deltaY < 0) {
                // User scrolling UP:
                if (targetProgress > 12.0) {
                    // Footer -> FAQ: Reverse back up to FAQ
                    var nowFaqUp = Date.now();
                    var timeSinceLastFaqUp = nowFaqUp - lastFaqScrollTime;

                    if (targetProgress > 12.60 && timeSinceLastFaqUp > 130) {
                        // Scroll 1 UP: Footer begins sliding back down
                        targetProgress = 12.50;
                        lastFaqScrollTime = nowFaqUp;
                        wakeRender();
                    } else if (targetProgress > 12.0 && timeSinceLastFaqUp > 130) {
                        // Scroll 2 UP: Footer slides away, locks at FAQ 100%
                        if (currentProgress > 12.05) currentProgress = 12.05;
                        targetProgress = 12.0;
                        lastFaqScrollTime = nowFaqUp;
                        wakeRender();
                    } else {
                        targetProgress = Math.max(12.0, targetProgress - (Math.abs(e.deltaY) / 350));
                        wakeRender();
                    }
                } else if (targetProgress > 10.0 && targetProgress <= 12.0) {
                    var nowMorePetsUp = Date.now();
                    var timeSinceLastMorePetsUp = nowMorePetsUp - lastMorePetsScrollTime;

                    if (targetProgress > 11.60 && timeSinceLastMorePetsUp > 130) {
                        // Scroll 1 UP: FAQ begins sliding back down
                        targetProgress = 11.45;
                        lastMorePetsScrollTime = nowMorePetsUp;
                        wakeRender();
                    } else if (targetProgress > 10.0 && timeSinceLastMorePetsUp > 130) {
                        // Scroll 2 UP: FAQ slides completely away, back to More Pets
                        if (currentProgress > 11.05) currentProgress = 11.05;
                        targetProgress = 10.0;
                        lastMorePetsScrollTime = nowMorePetsUp;
                        wakeRender();
                    } else {
                        targetProgress = Math.max(10.0, targetProgress - (Math.abs(e.deltaY) / 350));
                        wakeRender();
                    }
                } else if (targetProgress <= 10.0 && targetProgress > 9.0) {
                    // Stage 10 Reverse: More Pets section slides back down to bottom
                    if (currentProgress <= 10.04) {
                        targetProgress = Math.max(9.0, targetProgress - (Math.abs(e.deltaY) / morePetsDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 9.0 && targetProgress > 8.0) {
                    // Stage 9 Reverse: Scroll back up on Dog section (2.0s dwell)
                    if (currentProgress <= 9.04) {
                        targetProgress = Math.max(8.0, targetProgress - (Math.abs(e.deltaY) / dogDwellDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 8.0 && targetProgress > 7.0) {
                    // Stage 8 Reverse: Dog Section slides back down to bottom
                    if (currentProgress <= 8.04) {
                        targetProgress = Math.max(7.0, targetProgress - (Math.abs(e.deltaY) / dogSectionDelta));
                        wakeRender();
                    }
                } else if (targetProgress <= 7.0 && targetProgress > 3.0) {
                    // Stages 4-7 Reverse: Smooth scroll back up through Why Choose sequence
                    if (currentProgress <= 7.04) {
                        targetProgress = Math.max(3.0, targetProgress - (Math.abs(e.deltaY) / whyChooseTotalDelta) * 4.0);
                        wakeRender();
                    }
                } else if (targetProgress <= 3.0 && targetProgress > 2.0) {
                    // Stage 3 Reverse: Why Choose slides back out to right in 2 scrolls (slowly & smoothly)
                    if (currentProgress <= 3.04) {
                        var nowStage3Up = Date.now();
                        if (stage3IdleTimer) clearTimeout(stage3IdleTimer);

                        if (targetProgress > 2.55) {
                            // Scroll 1 UP: Slide halfway back out to right
                            targetProgress = 2.50;
                            lastStage3ScrollTime = nowStage3Up;
                            wakeRender();
                        } else if (nowStage3Up - lastStage3ScrollTime > 160) {
                            // Scroll 2 UP: Slide fully out to right, returning to Product Duo
                            targetProgress = 2.0;
                            wakeRender();
                        }
                    }
                } else if (targetProgress <= 2.0 && targetProgress > 1.0) {
                    // Stage 2 Reverse: Product slides back out to right in 2 scrolls (slowly & smoothly)
                    if (currentProgress <= 2.04) {
                        var nowStage2Up = Date.now();
                        if (stage2IdleTimer) clearTimeout(stage2IdleTimer);

                        if (targetProgress > 1.55) {
                            // Scroll 1 UP: Slide halfway back out to right
                            targetProgress = 1.50;
                            lastStage2ScrollTime = nowStage2Up;
                            wakeRender();
                        } else if (nowStage2Up - lastStage2ScrollTime > 160) {
                            // Scroll 2 UP: Slide fully out to right, returning to Profile
                            targetProgress = 1.0;
                            wakeRender();
                        }
                    }
                } else if (targetProgress <= 1.0 && targetProgress > 0.0) {
                    // Stage 1 Reverse: Profile slides back out to right in 2 scrolls (slowly & smoothly)
                    if (currentProgress <= 1.04) {
                        var nowUp = Date.now();
                        if (stage1IdleTimer) clearTimeout(stage1IdleTimer);

                        if (targetProgress > 0.55) {
                            // Scroll 1 UP: Slide halfway back
                            targetProgress = 0.50;
                            lastStage1ScrollTime = nowUp;
                            wakeRender();
                        } else if (nowUp - lastStage1ScrollTime > 160) {
                            // Scroll 2 UP: Slide fully out to right
                            targetProgress = 0.0;
                            wakeRender();
                        }
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
                if (whyTitleStage) {
                    whyTitleStage.style.transform = '';
                }
                if (whyTitleFill) {
                    whyTitleFill.style.clipPath = '';
                    whyTitleFill.style.webkitClipPath = '';
                }
                if (whyTitleOutline) {
                    whyTitleOutline.style.opacity = '';
                    whyTitleOutline.style.backgroundPosition = '';
                }
                if (whySectionGlowBeam) {
                    whySectionGlowBeam.style.opacity = '';
                }
                if (whyHeader) {
                    whyHeader.style.transform = '';
                    whyHeader.style.opacity = '1';
                }
                if (whySubtitle) {
                    whySubtitle.style.transform = '';
                    whySubtitle.style.opacity = '1';
                }
                whySubtitleWords.forEach(function (w) {
                    w.style.opacity = '';
                    w.style.transform = '';
                    w.style.filter = '';
                });
                if (compareTableWrapper) {
                    compareTableWrapper.style.transform = '';
                    compareTableWrapper.style.opacity = '1';
                    compareTableWrapper.style.pointerEvents = '';
                }
                whyColumns.forEach(function (col) {
                    col.style.transform = '';
                    col.style.opacity = '';
                });
                compareColHeaders.forEach(function (hdr) {
                    hdr.style.transform = '';
                    hdr.style.opacity = '';
                });
                compareTableRows.forEach(function (row) {
                    row.forEach(function (cell) {
                        cell.style.transform = '';
                        cell.style.opacity = '';
                    });
                });
                compareRowIcons.forEach(function (rowIcn) {
                    rowIcn.forEach(function (icn) {
                        icn.style.transform = '';
                        icn.style.opacity = '';
                    });
                });
                if (whyLightTrack) {
                    whyLightTrack.style.opacity = '';
                }

                if (dogSection) {
                    dogSection.style.clipPath = 'none';
                    dogSection.style.webkitClipPath = 'none';
                    dogSection.style.transform = '';
                    dogSection.style.opacity = '1';
                    dogSection.style.visibility = 'visible';
                    resetDogDesignAnimation();
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
        var promptTextEl = document.getElementById('dogPromptText') || (dogSection ? dogSection.querySelector('.dog_prompt_placeholder') : null);
        var tagColorLayer = document.getElementById('dogTagColorLayer');

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
                promptBtn.classList.add('btn-active-click');
                setTimeout(function () {
                    promptBtn.style.transform = '';
                    promptBtn.classList.remove('btn-active-click');
                }, 220);

                // Spawn sparkles around button
                var btnRect = promptBtn.getBoundingClientRect();
                var originX = btnRect.left + btnRect.width / 2;
                var originY = btnRect.top + btnRect.height / 2;
                var count = 12;
                for (var i = 0; i < count; i++) {
                    (function (idx) {
                        var spark = document.createElement('div');
                        spark.className = 'dog_sparkle_particle';
                        spark.style.position = 'fixed';
                        spark.style.left = originX + 'px';
                        spark.style.top = originY + 'px';
                        spark.style.width = '6px';
                        spark.style.height = '6px';
                        spark.style.borderRadius = '50%';
                        spark.style.pointerEvents = 'none';
                        spark.style.zIndex = '9999';
                        spark.style.background = 'radial-gradient(circle, #FFF0BA 20%, #E5BC64 70%, transparent 100%)';
                        spark.style.boxShadow = '0 0 10px rgba(229, 188, 100, 0.9)';

                        var angle = (idx / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
                        var dist = 32 + Math.random() * 45;
                        var destX = Math.cos(angle) * dist;
                        var destY = Math.sin(angle) * dist;

                        spark.style.transition = 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
                        document.body.appendChild(spark);

                        requestAnimationFrame(function () {
                            spark.style.transform = 'translate(' + destX + 'px, ' + destY + 'px) scale(0)';
                            spark.style.opacity = '0';
                        });

                        setTimeout(function () {
                            if (spark.parentNode) {
                                spark.parentNode.removeChild(spark);
                            }
                        }, 700);
                    })(i);
                }

                if (promptTextEl) {
                    promptTextEl.style.opacity = '0';
                    promptTextEl.style.transform = 'translateY(-6px)';
                    promptTextEl.style.transition = 'all 0.25s ease';

                    setTimeout(function () {
                        promptIdx = (promptIdx + 1) % prompts.length;
                        promptTextEl.textContent = prompts[promptIdx];
                        promptTextEl.style.transform = 'translateY(6px)';
                        setTimeout(function () {
                            promptTextEl.style.opacity = '1';
                            promptTextEl.style.transform = 'translateY(0)';
                        }, 50);
                    }, 250);
                }

                if (tagColorLayer && !tagColorLayer.classList.contains('color-revealed')) {
                    tagColorLayer.classList.add('color-revealed');
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
    // ========================================================
    // 5e. FAQ Hanusek-Style Interactive Wireframe & Chat Engine
    // - 21-shape inline SVG phone wireframe drawn as user scrolls
    // - Scroll progress p = clamp((viewportHeight * 0.9 - sectionTop) / (viewportHeight * 0.75)), smoothed with 0.12 lerp
    // - Entrance: label line draws to 46px, words rise blur-to-sharp, gold underline draws
    // - Accordion rows slide in staggered ~90ms, divider lines draw left to right
    // - After ~1.3s first question opens automatically
    // - Accordion as chat: 0fr -> 1fr grid, 3 bouncing dots for 650ms, letter-by-letter typing with blinking cursor
    // - Result card pops up at bottom after 650ms with spring scale/rise
    // - Phone screen light sweep & medal pulse rings
    // - 3D mouse tilt (up to 10 deg) with medal opposite offset
    // - 7s auto-cycle with 9s inactivity pause
    // - prefers-reduced-motion: final state with no typing or drawing
    // ========================================================

    var FAQ_DATA = [
        {
            id: 1,
            num: "01",
            question: "Does PawMedal work worldwide?",
            answer: "Yes, PawMedal Tag works wherever someone can scan the QR code or tap the NFC tag. PawMedal Finder uses Apple's Find My network to help locate your pet wherever the network is available."
        },
        {
            id: 2,
            num: "02",
            question: "Do I need a subscription?",
            answer: "No subscription required! PawMedal Tag and Finder have zero monthly fees. You get full access to all features forever with a single one-time purchase."
        },
        {
            id: 3,
            num: "03",
            question: "How long does the battery last?",
            answer: "PawMedal Finder has a user-replaceable standard battery that lasts up to one full year. The PawMedal QR/NFC Tag requires no battery or charging ever."
        },
        {
            id: 4,
            num: "04",
            question: "Is it waterproof?",
            answer: "Yes! Both the PawMedal Tag and Finder are IP67 waterproof and adventure-tested for swimming, heavy rain, snow, and mud."
        },
        {
            id: 5,
            num: "05",
            question: "Can I update my pet's information?",
            answer: "Instantly, anytime! You can update contact numbers, medical alerts, home address, and photos in your profile without changing or replacing the physical medal."
        },
        {
            id: 6,
            num: "06",
            question: "What if someone finds my pet?",
            answer: "When someone finds your pet, they can simply tap the medal with any smartphone or scan the QR code to see your pet profile, emergency contacts, and notify you instantly."
        }
    ];

    var faqCurrentIndex = 0;
    var faqEntrancePlayed = false;

    var currentP = 0;
    var targetP = 0;
    var rafProgressId = null;

    var currentTiltX = 0, currentTiltY = 0;
    var targetTiltX = 0, targetTiltY = 0;
    var relX = 0, relY = 0;
    var isHovering = false;
    var currentBasePhoneY = 50;
    var currentBaseMedalX = 160;
    var currentBaseMedalRot = -140;

    function toggleFaqItem(index) {
        if (index < 0 || index >= FAQ_DATA.length) return;
        var accordion = document.getElementById('faqAccordion');
        if (!accordion) return;
        var items = accordion.querySelectorAll('.faq_item');
        var targetItem = items[index];
        if (!targetItem) return;

        var isAlreadyActive = targetItem.classList.contains('active');

        // Only one item is open at a time, and clicking the open item closes it
        if (isAlreadyActive) {
            targetItem.classList.remove('active');
            var btn = targetItem.querySelector('.faq_question');
            if (btn) btn.setAttribute('aria-expanded', 'false');

            var cards = document.querySelectorAll('.faq_result_card');
            cards.forEach(function (card) {
                card.classList.remove('active');
            });
            return;
        }

        faqCurrentIndex = index;
        var data = FAQ_DATA[index];

        items.forEach(function (item, idx) {
            var btn = item.querySelector('.faq_question');
            if (idx === index) {
                item.classList.add('active');
                if (btn) btn.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Medal sends out two expanding gold rings
        var medalPulse = document.getElementById('faqMedalPulse');
        if (medalPulse) {
            medalPulse.classList.remove('pulse-active');
            void medalPulse.offsetWidth;
            medalPulse.classList.add('pulse-active');
        }

        // Soft light sweep moves down phone screen
        var sweep = document.getElementById('faqScreenSweep');
        if (sweep) {
            sweep.classList.remove('sweep-firing');
            void sweep.offsetWidth;
            sweep.classList.add('sweep-firing');
        }

        // Pop up the matching result card at the bottom of the phone screen
        var cards = document.querySelectorAll('.faq_result_card');
        cards.forEach(function (card) {
            var cid = parseInt(card.getAttribute('data-card-id'), 10);
            card.classList.toggle('active', cid === data.id);
        });
    }

    function resetFaqAnimation() {
        var accordion = document.getElementById('faqAccordion');
        if (accordion) {
            var items = accordion.querySelectorAll('.faq_item');
            items.forEach(function (item) {
                item.classList.remove('active');
                var btn = item.querySelector('.faq_question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
        var cards = document.querySelectorAll('.faq_result_card');
        cards.forEach(function (card) {
            card.classList.remove('active');
        });
        faqCurrentIndex = 0;
    }

    function calcScrollProgress() {
        var faqSection = document.getElementById('faqSection');
        if (!faqSection) return 0;
        var rect = faqSection.getBoundingClientRect();
        var vh = window.innerHeight || 800;
        // Scroll progress p = clamp((viewportHeight * 0.9 - sectionTop) / (viewportHeight * 0.75))
        var p = (vh * 0.9 - rect.top) / (vh * 0.75);
        return Math.max(0, Math.min(1, p));
    }

    function updatePhoneWireframe(p) {
        var phoneSvg = document.getElementById('faqPhoneSvg');
        var shapes = phoneSvg ? phoneSvg.querySelectorAll('.wf_shape') : [];
        var dogAvatar = document.getElementById('wfAvatarGroup') || document.getElementById('wfDogAvatar');
        var ringBg = document.getElementById('faqRingBg');
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion) {
            p = 1;
        }

        var numShapes = shapes.length;
        for (var i = 0; i < numShapes; i++) {
            var shape = shapes[i];
            var startF = (i / numShapes) * 0.55;
            var endF = startF + 0.25;
            var sp = Math.max(0, Math.min(1, (p - startF) / (endF - startF)));
            shape.style.strokeDashoffset = (1 - sp).toFixed(4);

            if (p >= 0.65 || reducedMotion) {
                var fp = reducedMotion ? 1 : Math.max(0, Math.min(1, (p - 0.65) / 0.35));
                var targetFillOpacity = parseFloat(shape.getAttribute('data-target-fill-opacity') || '1');
                shape.style.fillOpacity = (fp * targetFillOpacity).toFixed(3);
                shape.style.strokeOpacity = (1 - fp * 0.75).toFixed(3); // stroke fades to 25%
            } else {
                shape.style.fillOpacity = '0';
                shape.style.strokeOpacity = '1';
            }
        }

        if (dogAvatar) {
            if (p >= 0.8 || reducedMotion) {
                dogAvatar.style.opacity = reducedMotion ? '1' : Math.min(1, (p - 0.8) / 0.2).toFixed(3);
            } else {
                dogAvatar.style.opacity = '0';
            }
        }

        // Phone rises about 50px into place
        currentBasePhoneY = (1 - p) * 50;
        // Medal spins in from right (translateX 160px to 0, rotate 140deg to 0)
        currentBaseMedalX = (1 - p) * 160;
        currentBaseMedalRot = (1 - p) * -140;

        // Beige ring rotates slowly and scales up
        if (ringBg) {
            var ringScale = 0.8 + 0.2 * p;
            var ringRot = p * 25;
            ringBg.style.transform = 'translate(-42%, -50%) scale(' + ringScale.toFixed(3) + ') rotate(' + ringRot.toFixed(1) + 'deg)';
        }

        applyStageTransforms();
    }

    function applyStageTransforms() {
        var phoneStage = document.getElementById('faqPhoneStage');
        var medalStage = document.getElementById('faqMedalStage');

        currentTiltX += (targetTiltX - currentTiltX) * 0.12;
        currentTiltY += (targetTiltY - currentTiltY) * 0.12;

        if (phoneStage) {
            phoneStage.style.transform = 'translateY(' + currentBasePhoneY.toFixed(1) + 'px) perspective(900px) rotateX(' + currentTiltX.toFixed(2) + 'deg) rotateY(' + currentTiltY.toFixed(2) + 'deg)';
        }

        if (medalStage) {
            // Medal moves slightly the opposite way
            var medalTiltX = -currentTiltX * 0.6;
            var medalTiltY = -currentTiltY * 0.6;
            var oppX = relX * -18;
            var oppY = relY * -14;
            medalStage.style.transform = 'translate(' + (currentBaseMedalX + oppX).toFixed(1) + 'px, calc(-50% + ' + oppY.toFixed(1) + 'px)) rotate(' + currentBaseMedalRot.toFixed(1) + 'deg) perspective(900px) rotateX(' + medalTiltX.toFixed(2) + 'deg) rotateY(' + medalTiltY.toFixed(2) + 'deg)';
        }
    }

    function tickFaqScrollProgress() {
        targetP = calcScrollProgress();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            targetP = 1;
            currentP = 1;
        } else {
            currentP += (targetP - currentP) * 0.12;
        }

        updatePhoneWireframe(currentP);

        // Entrance plays once when section is 30% visible
        if (!faqEntrancePlayed && (currentP >= 0.3 || targetP >= 0.3)) {
            faqEntrancePlayed = true;
            var faqSection = document.getElementById('faqSection');
            if (faqSection) faqSection.classList.add('faq-entered');
        }

        if (Math.abs(targetP - currentP) > 0.002 || isHovering || Math.abs(targetTiltX - currentTiltX) > 0.02 || Math.abs(targetTiltY - currentTiltY) > 0.02) {
            rafProgressId = requestAnimationFrame(tickFaqScrollProgress);
        } else {
            rafProgressId = null;
        }
    }

    function onFaqScrollOrUpdate() {
        if (!rafProgressId) {
            rafProgressId = requestAnimationFrame(tickFaqScrollProgress);
        }
    }

    function initFaqInteractive() {
        var accordion = document.getElementById('faqAccordion');
        var stage = document.getElementById('faqVisualStage');
        var medalStage = document.getElementById('faqMedalStage');

        // Accordion question click listeners
        if (accordion) {
            var items = accordion.querySelectorAll('.faq_item');
            items.forEach(function (item, idx) {
                var btn = item.querySelector('.faq_question');
                if (btn) {
                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        toggleFaqItem(idx);
                    });
                }
            });
        }

        // Medal click listener: advances question
        if (medalStage) {
            medalStage.addEventListener('click', function () {
                var nextIndex = (faqCurrentIndex + 1) % FAQ_DATA.length;
                toggleFaqItem(nextIndex);
            });
        }

        // 3D Mouse-Follow Tilt (up to 10 degrees)
        if (stage) {
            stage.addEventListener('mousemove', function (e) {
                var rect = stage.getBoundingClientRect();
                relX = (e.clientX - rect.left) / rect.width - 0.5;
                relY = (e.clientY - rect.top) / rect.height - 0.5;
                targetTiltY = relX * 10;
                targetTiltX = -relY * 10;
                isHovering = true;
                onFaqScrollOrUpdate();
            });

            stage.addEventListener('mouseleave', function () {
                targetTiltX = 0;
                targetTiltY = 0;
                relX = 0;
                relY = 0;
                isHovering = false;
                onFaqScrollOrUpdate();
            });
        }

        window.addEventListener('scroll', onFaqScrollOrUpdate, { passive: true });
        window.addEventListener('resize', onFaqScrollOrUpdate, { passive: true });

        // Initial tick
        onFaqScrollOrUpdate();
    }

    function initFaqObserver() {
        var faqSection = document.getElementById('faqSection');
        if (!faqSection) return;

        if ('IntersectionObserver' in window) {
            var faqObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        onFaqScrollOrUpdate();
                        if (entry.intersectionRatio >= 0.3 && !faqEntrancePlayed) {
                            faqEntrancePlayed = true;
                            faqSection.classList.add('faq-entered');
                        }
                    }
                });
            }, {
                threshold: [0.1, 0.3, 0.6, 0.9],
                rootMargin: '0px 0px -40px 0px'
            });

            faqObserver.observe(faqSection);
        }
    }


    function initFooter() {
        var form = document.getElementById('footerNewsletterForm');
        var input = document.getElementById('footerEmailInput');
        var feedback = document.getElementById('footerFormFeedback');
        var yearEl = document.getElementById('footerYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        if (form && input && feedback) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var email = input.value.trim();
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                    feedback.textContent = 'Please enter a valid email address.';
                    feedback.className = 'footer_form_feedback error show';
                    return;
                }
                feedback.textContent = '✓ Thank you for subscribing! Check your inbox soon.';
                feedback.className = 'footer_form_feedback show';
                input.value = '';
                setTimeout(function () {
                    feedback.className = 'footer_form_feedback';
                }, 4500);
            });
        }
    }

})();
