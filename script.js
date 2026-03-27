/* ========================================
   PORTFOLIO - MAIN JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSmartNavigation();
    initWorksCarousel();
    initCounterAnimation();
});

/* ========================================
   SMART NAVIGATION
   ======================================== */
function initSmartNavigation() {
    const nav = document.getElementById('navbar');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('section[id]');

    if (!nav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    nav.classList.add('nav-hidden');
                } else {
                    nav.classList.remove('nav-hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.target === id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
}


/* ========================================
   WORKS CAROUSEL (5 элементов + анимация)
   ======================================== */
function initWorksCarousel() {
    const track = document.getElementById('worksTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const leftPreview = document.getElementById('leftPreview');
    const rightPreview = document.getElementById('rightPreview');
    const caption = document.getElementById('workCaption');

    if (!track) return;

    const slides = track.querySelectorAll('.work-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;

    const projectNames = [
        'Название проекта 1',
        'Название проекта 2', 
        'Название проекта 3',
        'Название проекта 4',
        'Название проекта 5'
    ];

    const images = [
        'img/work_1.jpg',
        'img/work_2.jpg',
        'img/work_3.jpg',
        'img/work_4.jpg',
        'img/work_5.jpg'
    ];

    const projectUrls = [
        'project1.html', 
        'project2.html', 
        'project3.html',
        'project4.html',
        'project5.html'
    ];

    function updateCarousel(direction = null) {
        if (isAnimating) return;
        isAnimating = true;

        // Обновляем активный слайд с анимацией и управлением кликабельностью
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
                slide.style.pointerEvents = 'auto'; // Включаем клики
                slide.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
                slide.style.transition = 'none';
                
                setTimeout(() => {
                    slide.style.transition = 'all 0.5s ease';
                    slide.style.transform = 'translateX(0)';
                }, 10);
            } else {
                slide.classList.remove('active');
                slide.style.pointerEvents = 'none'; // Отключаем клики на неактивных
            }
        });

        // Обновляем превью с плавным переходом
        if (leftPreview) {
            const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            leftPreview.style.opacity = '0';
            setTimeout(() => {
                leftPreview.querySelector('img').src = images[leftIndex];
                leftPreview.style.opacity = '0.5';
            }, 200);
        }

        if (rightPreview) {
            const rightIndex = (currentIndex + 1) % totalSlides;
            rightPreview.style.opacity = '0';
            setTimeout(() => {
                rightPreview.querySelector('img').src = images[rightIndex];
                rightPreview.style.opacity = '0.5';
            }, 200);
        }

        // Обновляем подпись с анимацией
        if (caption) {
            caption.style.opacity = '0';
            caption.style.transform = 'translateY(10px)';
            caption.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                caption.textContent = projectNames[currentIndex];
                caption.style.opacity = '1';
                caption.style.transform = 'translateY(0)';
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel('prev');
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel('next');
    }

    // Переход к конкретному слайду по индексу
    function goToSlide(index) {
        if (index === currentIndex || isAnimating) return;
        const direction = index > currentIndex ? 'next' : 'prev';
        currentIndex = index;
        updateCarousel(direction);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrev);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToNext);
    }

    // Клик по левому превью — переход к предыдущему слайду
    if (leftPreview) {
        leftPreview.addEventListener('click', () => {
            const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            window.location.href = projectUrls[leftIndex];
        });
        leftPreview.style.cursor = 'pointer';
    }

    // Клик по правому превью — переход к следующему слайду
    if (rightPreview) {
        rightPreview.addEventListener('click', () => {
            const rightIndex = (currentIndex + 1) % totalSlides;
            window.location.href = projectUrls[rightIndex];
        });
        rightPreview.style.cursor = 'pointer';
    }

    // === ИСПРАВЛЕННЫЙ ОБРАБОТЧИК КЛИКА ===
    // Навешиваем обработчик на каждый слайд
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            // Проверяем, что кликнули именно по активному слайду
            if (!slide.classList.contains('active')) return;
            
            // Переходим на соответствующий проект
            if (projectUrls[currentIndex]) {
                window.location.href = projectUrls[currentIndex];
            }
        });
    });

    // Свайп для мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    }

    // Инициализация
    updateCarousel();
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.skill-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ========================================
   IMAGE ERROR HANDLING
   ======================================== */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.opacity = '0.3';
        this.style.background = 'linear-gradient(135deg, #2a343e, #1a1a1a)';
    });
});