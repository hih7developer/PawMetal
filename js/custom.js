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

    function initAll() {
        initBannerEntrance();
        initSmoothParallax();
        initSpyltNextSection();
        initChooseSection();
        initProfileSection();
        initProductDuoSection();
        initTopBarClose();
        initBackToTop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // ========================================================
    // 1. Kinetic Staggered Word Entrance
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
            wordsArray.forEach(function (item, index) {
                var wrap = document.createElement('span');
                wrap.className = 'word-wrap';

                var inner = document.createElement('span');
                inner.className = 'word-inner' + (item.isYellow ? ' ylwtxt' : '');
                inner.textContent = item.text;
                inner.style.transitionDelay = (index * 0.08 + 0.15).toFixed(2) + 's';

                wrap.appendChild(inner);
                h1.appendChild(wrap);
            });
        }

        // Trigger entrance
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                banner.classList.add('revealed');
            });
        });
    }

    // ========================================================
    // 2. Dog Image Cursor Follower & Reactive Parallax
    // ========================================================
    function initSmoothParallax() {
        var banner = document.querySelector('.banner');
        if (!banner) return;

        var bg = banner.querySelector('.bnr_bg');
        var content = banner.querySelector('.bnr_content');
        var pets = banner.querySelector('.bnr_pets');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Reset entrance transition on pets so cursor tracking has direct, responsive control
        setTimeout(function () {
            if (pets) pets.style.transition = 'none';
        }, 1450);

        var rect = banner.getBoundingClientRect();
        function updateRect() {
            rect = banner.getBoundingClientRect();
        }
        window.addEventListener('resize', updateRect, { passive: true });
        window.addEventListener('scroll', updateRect, { passive: true });

        // Physics State (Linear Interpolation for smooth cursor follow)
        var state = {
            targetPetX: 0,
            targetPetY: 0,
            currPetX: 0,
            currPetY: 0,
            targetPetRotate: 0,
            currPetRotate: 0,
            targetPetScale: 1,
            currPetScale: 1,
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
            var ease = 0.075; // Silky cursor follow inertia

            state.currPetX = lerp(state.currPetX, state.targetPetX, ease);
            state.currPetY = lerp(state.currPetY, state.targetPetY, ease);
            state.currPetRotate = lerp(state.currPetRotate, state.targetPetRotate, ease);
            state.currPetScale = lerp(state.currPetScale, state.targetPetScale, ease);

            state.currBgX = lerp(state.currBgX, state.targetBgX, ease);
            state.currBgY = lerp(state.currBgY, state.targetBgY, ease);

            state.currContentX = lerp(state.currContentX, state.targetContentX, ease);
            state.currContentY = lerp(state.currContentY, state.targetContentY, ease);

            // Dog image cursor effect: extends, leans, and tracks the mouse from bottom right
            if (pets) {
                pets.style.transform = 'translate3d(' + state.currPetX.toFixed(2) + 'px, ' + state.currPetY.toFixed(2) + 'px, 0) rotate(' + state.currPetRotate.toFixed(2) + 'deg) scale(' + state.currPetScale.toFixed(3) + ')';
            }
            if (bg) {
                bg.style.transform = 'translate3d(' + state.currBgX.toFixed(2) + 'px, ' + state.currBgY.toFixed(2) + 'px, 0)';
            }
            if (content) {
                content.style.transform = 'translate3d(' + state.currContentX.toFixed(2) + 'px, ' + state.currContentY.toFixed(2) + 'px, 0)';
            }

            // Sleep when idle to conserve resources
            var delta = Math.abs(state.currPetX - state.targetPetX) +
                        Math.abs(state.currPetY - state.targetPetY) +
                        Math.abs(state.currPetRotate - state.targetPetRotate);

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

            // Cursor effect: As cursor moves across banner, the dog reaches, leans, and follows the pointer
            state.targetPetX = normX * 42;
            state.targetPetY = normY * 30;
            state.targetPetRotate = normX * 4.5;
            state.targetPetScale = 1 + (Math.abs(normX) * 0.02) + (relX > 0.6 ? 0.025 : 0);

            // Subtle counter-parallax on background & content
            state.targetBgX = -normX * 14;
            state.targetBgY = -normY * 9;

            state.targetContentX = -normX * 8;
            state.targetContentY = -normY * 6;
        }, { passive: true });

        // Mouse Leave - Smooth Return to Resting State
        banner.addEventListener('mouseleave', function () {
            state.isHovered = false;
            wakeUp();

            state.targetPetX = 0;
            state.targetPetY = 0;
            state.targetPetRotate = 0;
            state.targetPetScale = 1;

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
    // 4. Choose Section: Mouse Scroll Reveal & Interactive Cursor Physics
    //    Inspired by Spylt, Cuberto & Kafe
    // ========================================================
    function initChooseSection() {
        var chooseSection = document.getElementById('chooseSection');
        if (!chooseSection) return;

        var cards = chooseSection.querySelectorAll('.choose_card');
        var buttons = chooseSection.querySelectorAll('.choose_btn');
        if (!cards || cards.length === 0) return;

        var hasEntered = false;

        // 1. Scroll-driven Entrance Reveal
        if ('IntersectionObserver' in window) {
            var scrollObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        chooseSection.classList.add('in-view');
                        // After entrance finishes (~1.3s), switch cards from CSS transitions
                        // to high-performance RAF lerp transforms for butter-smooth cursor tracking
                        setTimeout(function () {
                            hasEntered = true;
                            cards.forEach(function (card) {
                                card.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
                            });
                        }, 1350);
                        scrollObserver.unobserve(chooseSection);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            scrollObserver.observe(chooseSection);
        } else {
            chooseSection.classList.add('in-view');
            hasEntered = true;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // 2. Physics States for Cards & Product Images
        // Card 1 (PawMedal Tag), Card 2 (PawMedal Finder - Featured), Card 3 (PawMedal Bundle)
        var cardStates = [];
        var imgWraps = [];

        cards.forEach(function (card) {
            var imgWrap = card.querySelector('.card_img_wrap');
            imgWraps.push(imgWrap);

            cardStates.push({
                currX: 0,
                targetX: 0,
                currY: 0,
                targetY: 0,
                currRotX: 0,
                targetRotX: 0,
                currRotY: 0,
                targetRotY: 0,
                currRotZ: 0,
                targetRotZ: 0,
                currScale: 1,
                targetScale: 1,

                // Inner image micro-parallax
                imgCurrX: 0,
                imgTargetX: 0,
                imgCurrY: 0,
                imgTargetY: 0
            });
        });

        var isCursorActive = false;
        var rafChooseId = null;

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function renderChoose() {
            if (!hasEntered) {
                rafChooseId = requestAnimationFrame(renderChoose);
                return;
            }

            var ease = 0.08;
            var maxDelta = 0;

            cards.forEach(function (card, idx) {
                var s = cardStates[idx];
                var imgWrap = imgWraps[idx];

                s.currX = lerp(s.currX, s.targetX, ease);
                s.currY = lerp(s.currY, s.targetY, ease);
                s.currRotX = lerp(s.currRotX, s.targetRotX, ease);
                s.currRotY = lerp(s.currRotY, s.targetRotY, ease);
                s.currRotZ = lerp(s.currRotZ, s.targetRotZ, ease);
                s.currScale = lerp(s.currScale, s.targetScale, ease);

                s.imgCurrX = lerp(s.imgCurrX, s.imgTargetX, ease);
                s.imgCurrY = lerp(s.imgCurrY, s.imgTargetY, ease);

                // Apply 3D spatial transform to card
                card.style.transform = 'perspective(1100px) translate3d(' +
                    s.currX.toFixed(2) + 'px, ' +
                    s.currY.toFixed(2) + 'px, 0) ' +
                    'rotateX(' + s.currRotX.toFixed(2) + 'deg) ' +
                    'rotateY(' + s.currRotY.toFixed(2) + 'deg) ' +
                    'rotateZ(' + s.currRotZ.toFixed(2) + 'deg) ' +
                    'scale(' + s.currScale.toFixed(3) + ')';

                // Apply micro-parallax to inner image
                if (imgWrap) {
                    imgWrap.style.transform = 'translate3d(' +
                        s.imgCurrX.toFixed(2) + 'px, ' +
                        s.imgCurrY.toFixed(2) + 'px, 0)';
                }

                maxDelta += Math.abs(s.currX - s.targetX) +
                    Math.abs(s.currY - s.targetY) +
                    Math.abs(s.currRotX - s.targetRotX) +
                    Math.abs(s.currRotY - s.targetRotY);
            });

            if (!isCursorActive && maxDelta < 0.005) {
                rafChooseId = null;
                return;
            }

            rafChooseId = requestAnimationFrame(renderChoose);
        }

        function wakeChoose() {
            if (!rafChooseId) {
                rafChooseId = requestAnimationFrame(renderChoose);
            }
        }

        // 3. Mouse Movement - Multi-Card Wave & 3D Spatial Tilt (Spylt & Cuberto style)
        window.addEventListener('mousemove', function (e) {
            isCursorActive = true;
            wakeChoose();

            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var normX = (e.clientX / winW - 0.5) * 2; // -1 to 1
            var normY = (e.clientY / winH - 0.5) * 2; // -1 to 1

            // Proximity scaling
            var secRect = chooseSection.getBoundingClientRect();
            var isNearSection = (
                e.clientY >= secRect.top - 140 &&
                e.clientY <= secRect.bottom + 140
            );

            var intensity = isNearSection ? 1.0 : 0.4;

            if (cardStates[0]) {
                // Card 1 (Left: PawMedal Tag) - subtle tilt outward to the left
                cardStates[0].targetX = normX * 14 * intensity;
                cardStates[0].targetY = normY * 9 * intensity;
                cardStates[0].targetRotY = normX * 3.5 * intensity;
                cardStates[0].targetRotX = -normY * 2.8 * intensity;
                cardStates[0].targetRotZ = normX * 0.9 * intensity;
                cardStates[0].imgTargetX = -normX * 8 * intensity;
                cardStates[0].imgTargetY = -normY * 6 * intensity;
            }

            if (cardStates[1]) {
                // Card 2 (Center: PawMedal Finder - Featured) - elevated floating prominence
                cardStates[1].targetX = normX * 6 * intensity;
                cardStates[1].targetY = (normY * 11 - 6) * intensity;
                cardStates[1].targetRotY = normX * 1.8 * intensity;
                cardStates[1].targetRotX = -normY * 2.2 * intensity;
                cardStates[1].targetRotZ = 0;
                cardStates[1].imgTargetX = -normX * 6 * intensity;
                cardStates[1].imgTargetY = -normY * 8 * intensity;
            }

            if (cardStates[2]) {
                // Card 3 (Right: PawMedal Bundle) - subtle tilt outward to the right
                cardStates[2].targetX = normX * 14 * intensity;
                cardStates[2].targetY = normY * 9 * intensity;
                cardStates[2].targetRotY = normX * 3.5 * intensity;
                cardStates[2].targetRotX = -normY * 2.8 * intensity;
                cardStates[2].targetRotZ = -normX * 0.9 * intensity;
                cardStates[2].imgTargetX = -normX * 8 * intensity;
                cardStates[2].imgTargetY = -normY * 6 * intensity;
            }
        }, { passive: true });

        // Mouse Leave Window - Reset to Rest Position
        window.addEventListener('mouseleave', function () {
            isCursorActive = false;
            wakeChoose();

            cardStates.forEach(function (s) {
                s.targetX = 0;
                s.targetY = 0;
                s.targetRotX = 0;
                s.targetRotY = 0;
                s.targetRotZ = 0;
                s.targetScale = 1;
                s.imgTargetX = 0;
                s.imgTargetY = 0;
            });
        });

        // 4. Card Hover Spotlight & Specular Glare (Kafe inspiration)
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            }, { passive: true });
        });

        // 5. Cuberto-Style Magnetic Buttons with Elastic Arrow Movement
        buttons.forEach(function (btn) {
            var arrow = btn.querySelector('i');

            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var relX = e.clientX - rect.left - rect.width / 2;
                var relY = e.clientY - rect.top - rect.height / 2;

                // Magnetic attraction on button body
                btn.style.transform = 'translate(' + (relX * 0.22).toFixed(1) + 'px, ' + (relY * 0.22).toFixed(1) + 'px)';

                // Enhanced travel on arrow icon
                if (arrow) {
                    arrow.style.transform = 'translate(' + (relX * 0.15 + 4).toFixed(1) + 'px, ' + (relY * 0.12).toFixed(1) + 'px)';
                }
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0px, 0px)';
                if (arrow) {
                    arrow.style.transform = 'translate(0px, 0px)';
                }
            });
        });

        // 6. Smooth Mouse Scroll Depth Parallax
        window.addEventListener('scroll', function () {
            if (!chooseSection) return;
            var secRect = chooseSection.getBoundingClientRect();
            var winH = window.innerHeight;

            if (secRect.top < winH && secRect.bottom > 0) {
                var progress = (winH - secRect.top) / (winH + secRect.height);
                var shiftCenter = (progress - 0.5) * -16;
                if (hasEntered && cardStates[1]) {
                    cardStates[1].targetY = shiftCenter;
                    wakeChoose();
                }
            }
        }, { passive: true });
    }

    // ========================================================
    // 5. Choose, Profile, Product & Why Choose Sticky-Stack Reveal (Bidirectional 3-Stage Navigation)
    //    Stage 1: Scroll for 3-4s over Choose section -> Profile section slowly appears from right
    //    Stage 2: Scroll for 3-4s on Profile section -> Product section opens from middle like a window
    //    Stage 3: Product section remains same, scroll for 3-4s -> Why Choose section appears from bottom smoothly
    //    Reverse: Scrolling UP smoothly reverses each section one by one without skipping or sudden jumps!
    // ========================================================
    function initProfileSection() {
        var wrapper = document.getElementById('chooseProfilePinWrapper') || document.getElementById('choosePinWrapper');
        var chooseSection = document.getElementById('chooseSection');
        var profileSection = document.getElementById('profileSection');
        var productSection = document.getElementById('productDuoSection');
        var whyChooseSection = document.getElementById('whyChooseSection');
        if (!wrapper || !profileSection) return;

        var duoCards = productSection ? productSection.querySelectorAll('.duo_card') : [];
        var whySpotlight = document.getElementById('whySpotlight');

        var targetProgress = 0; // Range: 0.0 to 4.0 (0-1: Profile in, 1-2: Product opens, 2-3: Product dwell 4s, 3-4: Why Choose from bottom)
        var currentProgress = 0;
        var profileRevealed = false;
        var rafId = null;
        var handTimer = null;
        var arrowTimer = null;

        // ~3-4 seconds of continuous wheel scrolling per stage (~3400px scroll delta each)
        var stage1Delta = 3400;
        var stage2Delta = 3400;
        var productDwellDelta = 3000; // Scroll for 3 SECONDS on the Product section!
        var stage4Delta = 3600;       // THEN ONLY Why Choose section appears from bottom smoothly (3-4s)

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

                // 1. Choose Section: stays stacked right there in place
                if (chooseSection) {
                    chooseSection.style.transform = 'translate3d(0, 0, 0)';
                    chooseSection.style.opacity = '1';
                    chooseSection.style.visibility = 'visible';
                }

                // 2. Profile Section: slides over stacked Choose section from the right (100% -> 0%)
                var translateX = (1 - p1) * 100;
                profileSection.style.transform = 'translate3d(' + translateX.toFixed(3) + '%, 0, 0)';
                profileSection.style.opacity = '1';
                profileSection.style.filter = '';

                if (p1 > 0.005) {
                    profileSection.style.visibility = 'visible';
                } else {
                    profileSection.style.visibility = 'hidden';
                }

                if (p1 > 0.3) {
                    profileSection.classList.add('in-view');
                } else {
                    profileSection.classList.remove('in-view');
                }

                // Hand & arrow animation on arrival
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

                // Product Section closed in center
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

                // Why Choose Section hidden at bottom
                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
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

                // Profile recedes into depth
                var profScale = 1 - (p2 * 0.08);
                var profBrightness = 1 - (p2 * 0.18);
                var profBlur = p2 * 2.5;
                var profOpacity = 1 - (p2 * 0.25);
                profileSection.style.transform = 'scale(' + profScale.toFixed(3) + ')';
                profileSection.style.filter = 'brightness(' + profBrightness.toFixed(3) + ') blur(' + profBlur.toFixed(1) + 'px)';
                profileSection.style.opacity = profOpacity.toFixed(3);
                profileSection.style.visibility = 'visible';

                // Product section aperture opens from center
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

                // Why Choose Section remains hidden at bottom
                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }

            } else if (currentProgress <= 3.0) {
                // ========================================== 
                // STAGE 3: SCROLL FOR 3 SECONDS ON PRODUCT SECTION (2.0 to 3.0)
                // Product section remains completely still, open and interactive!
                // Why Choose section remains hidden below until 3 seconds of scroll finish.
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

                // Product section remains 100% active, pinned and stable in place!
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

                // Why Choose section remains hidden at bottom during the 3-second scroll on product section
                if (whyChooseSection) {
                    whyChooseSection.style.transform = 'translate3d(0, 100%, 0)';
                    whyChooseSection.style.visibility = 'hidden';
                    whyChooseSection.classList.remove('in-view', 'spotlight-active');
                }

            } else {
                // ========================================== 
                // STAGE 4: AFTER 3 SECONDS SCROLL ON PRODUCT SECTION,
                // THEN ONLY WHY CHOOSE SECTION APPEARS FROM BOTTOM SMOOTHLY (3.0 to 4.0)
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

                // Product section remains pinned in place under Why Choose
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

                // Why Choose section appears smoothly from bottom (100% -> 0%)
                if (whyChooseSection) {
                    var translateY = (1 - p4) * 100;
                    whyChooseSection.style.transform = 'translate3d(0, ' + translateY.toFixed(3) + '%, 0)';
                    whyChooseSection.style.opacity = '1';
                    whyChooseSection.style.visibility = (p4 > 0.005) ? 'visible' : 'hidden';

                    // Suggested animation timeline:
                    // 0-15%: Heading fades and moves upward
                    // 15-35%: Golden wave sweeps across
                    // 35-55%: Four columns reveal sequentially
                    // 55-80%: Feature rows and checkmarks animate (scanner)
                    // 80-100%: Golden spotlight interaction becomes active
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
        }

        // Active mouse wheel scroll handler (bidirectional 4-stage navigation)
        window.addEventListener('wheel', function (e) {
            if (window.innerWidth <= 991) return;

            var rect = wrapper.getBoundingClientRect();
            // Is pinned container active in viewport?
            var isInsidePin = (rect.top <= 60 || targetProgress > 0) && (rect.bottom > 120);
            if (!isInsidePin) return;

            if (e.deltaY > 0) {
                // User scrolling DOWN:
                if (targetProgress < 1.0) {
                    // Stage 1: Choose -> Profile (3-4s scroll)
                    targetProgress = Math.min(1.0, targetProgress + (e.deltaY / stage1Delta));
                    wakeRender();
                } else if (targetProgress >= 1.0 && targetProgress < 2.0) {
                    // Stage 2: Profile -> Product window opens (3-4s scroll)
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
                    // Stage 4: THEN ONLY Why Choose appears from bottom smoothly (3-4s scroll)!
                    if (currentProgress >= 2.96) {
                        targetProgress = Math.min(4.0, targetProgress + (e.deltaY / stage4Delta));
                        wakeRender();
                    }
                }
            } else if (e.deltaY < 0) {
                // User scrolling UP:
                if (targetProgress > 3.0) {
                    // Stage 4 Reverse: Why choose section slides back down to bottom smoothly
                    targetProgress = Math.max(3.0, targetProgress - (Math.abs(e.deltaY) / stage4Delta));
                    wakeRender();
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
            }
        }, { passive: true });
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
