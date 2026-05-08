document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Loader ---
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
        }, 1200); // Extended cinematic delay
    });

    // --- 2. Global Mouse Tracking for Reactive Lighting ---
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            // Update CSS variables for radial gradient background glow
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // --- 3. Scroll Progress Bar & Parallax ---
    const progressBar = document.getElementById('scroll-progress');
    const parallaxImg1 = document.getElementById('parallax-img-1');
    const parallaxCol1 = document.getElementById('parallax-col-1');
    const parallaxCol2 = document.getElementById('parallax-col-2');
    const parallaxCol3 = document.getElementById('parallax-col-3');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Custom Parallax logic
        if (!isTouchDevice) {
            requestAnimationFrame(() => {
                if (parallaxImg1) parallaxImg1.style.transform = `translateY(${scrollTop * -0.05}px)`;
                if (parallaxCol1) parallaxCol1.style.transform = `translateY(${scrollTop * 0.05 - 100}px)`;
                if (parallaxCol2) parallaxCol2.style.transform = `translateY(${scrollTop * -0.08 + 150}px)`;
                if (parallaxCol3) parallaxCol3.style.transform = `translateY(${scrollTop * 0.04 - 80}px)`;
            });
        }
    });

    // --- 4. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 5. Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- 6. Intersection Observer for Cinematic Staggered Reveals ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counter animation
                if (entry.target.classList.contains('stat-item') || entry.target.classList.contains('transform-card')) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        if (!counter.classList.contains('counted')) {
                            animateCounter(counter);
                            counter.classList.add('counted');
                        }
                    });
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // --- 7. Counter Animation ---
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2500; // 2.5 seconds
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    }

    // --- 8. Smooth Scrolling for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                window.scrollTo({
                    top: targetEl.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 9. Custom Cursor & Magnetic Buttons ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower && !isTouchDevice) {
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });
        
        const renderCursor = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        const interactiveElements = document.querySelectorAll('a, button, .class-card, .toggle-switch, .faq-question, .transform-card, .community-img');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
                cursor.classList.add('active');
                if (el.classList.contains('btn')) {
                    follower.classList.add('magnetic');
                }
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
                cursor.classList.remove('active');
                follower.classList.remove('magnetic');
            });
        });

        // Magnetic Button Physics
        const btns = document.querySelectorAll('.btn');
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // --- 10. Pricing Toggle ---
    const pricingToggle = document.getElementById('pricing-toggle');
    const pricingSection = document.querySelector('.pricing');
    const monthlyLabel = document.getElementById('monthly-label');
    const yearlyLabel = document.getElementById('yearly-label');
    const amounts = document.querySelectorAll('.price .amount');

    if (pricingToggle) {
        pricingToggle.addEventListener('click', () => {
            pricingSection.classList.toggle('yearly');
            const isYearly = pricingSection.classList.contains('yearly');
            
            if (isYearly) {
                monthlyLabel.classList.remove('active');
                yearlyLabel.classList.add('active');
                amounts.forEach(amount => amount.innerText = amount.getAttribute('data-yearly'));
            } else {
                yearlyLabel.classList.remove('active');
                monthlyLabel.classList.add('active');
                amounts.forEach(amount => amount.innerText = amount.getAttribute('data-monthly'));
            }
        });
    }

    // --- 11. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

});
