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
   WORKS CAROUSEL - ПЛАВНЫЕ ПРЕВЬЮ
   ======================================== */
function initWorksCarousel() {
    const track = document.getElementById('worksTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const leftPreview = document.getElementById('leftPreview');
    const rightPreview = document.getElementById('rightPreview');
    const caption = document.getElementById('workCaption');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.work-slide'));
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;

    const projectNames = [
        'Фантом - Santimental',
        'Интернет - Lyralei(amv)', 
        'E$CORT - Nikitata(amv)',
        'Oblivion - Santimental',
        'ИНДИВИДУАЛЬНЫЙ ЗАКАЗ'
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

    function updatePreviews() {
        // Плавное исчезновение левого превью
        if (leftPreview) {
            leftPreview.style.opacity = '0';
            leftPreview.style.transform = 'scale(0.8) translateX(-20px)';
            leftPreview.style.filter = 'grayscale(100%)';
            
            setTimeout(() => {
                const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                leftPreview.querySelector('img').src = images[leftIndex];
                
                // Плавное появление
                leftPreview.style.opacity = '0.4';
                leftPreview.style.transform = 'scale(0.9) translateX(0)';
                leftPreview.style.filter = 'grayscale(30%)';
            }, 200);
        }

        // Плавное исчезновение правого превью
        if (rightPreview) {
            rightPreview.style.opacity = '0';
            rightPreview.style.transform = 'scale(0.8) translateX(20px)';
            rightPreview.style.filter = 'grayscale(100%)';
            
            setTimeout(() => {
                const rightIndex = (currentIndex + 1) % totalSlides;
                rightPreview.querySelector('img').src = images[rightIndex];
                
                // Плавное появление
                rightPreview.style.opacity = '0.4';
                rightPreview.style.transform = 'scale(0.9) translateX(0)';
                rightPreview.style.filter = 'grayscale(30%)';
            }, 200);
        }
    }

    function updateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Убираем все классы
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
            slide.style.zIndex = '0';
        });

        // Устанавливаем предыдущий слайд
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        slides[prevIndex].classList.add('prev');
        slides[prevIndex].style.transform = 'translateX(-100%)';

        // Устанавливаем активный слайд
        slides[currentIndex].classList.add('active');
        slides[currentIndex].style.opacity = '1';
        slides[currentIndex].style.transform = 'translateX(0)';
        slides[currentIndex].style.zIndex = '2';

        // Обновляем превью с анимацией
        updatePreviews();

        // Обновляем подпись
        if (caption) {
            caption.classList.add('changing');
            
            setTimeout(() => {
                caption.textContent = projectNames[currentIndex];
                caption.classList.remove('changing');
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel('prev');
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel('next');
    }

    // Обработчики кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNext();
        });
    }

    // Клик по превью
    if (leftPreview) {
        leftPreview.addEventListener('click', () => {
            if (isAnimating) return;
            const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            window.location.href = projectUrls[leftIndex];
        });
    }

    if (rightPreview) {
        rightPreview.addEventListener('click', () => {
            if (isAnimating) return;
            const rightIndex = (currentIndex + 1) % totalSlides;
            window.location.href = projectUrls[rightIndex];
        });
    }

    // Клик по активному слайду
    slides.forEach((slide) => {
        slide.addEventListener('click', () => {
            if (!slide.classList.contains('active')) return;
            window.location.href = projectUrls[currentIndex];
        });
    });

    // Свайп
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

    // Инициализация превью
    if (leftPreview) {
        leftPreview.querySelector('img').src = images[(currentIndex - 1 + totalSlides) % totalSlides];
    }
    if (rightPreview) {
        rightPreview.querySelector('img').src = images[(currentIndex + 1) % totalSlides];
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

/* ========================================
   TELEGRAM FORM LOGIC
   ======================================== */
document.getElementById('tg-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const TOKEN = "8676011684:AAH_lHwRtmzzRkDNAJkDDZ-U0OVHO8IyArg";
    const CHAT_ID = "718062995";
    const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const btn = this.querySelector('.submit-btn');
    const originalText = btn.innerText;
    btn.innerText = "Отправка...";
    btn.disabled = true;

    const message = `
<b>Новая заявка!</b>
<b>ФИО:</b> ${this.name.value}
<b>Телефон:</b> ${this.phone.value}
<b>Проект:</b> ${this.project_name.value}
<b>Бюджет:</b> ${this.budget.value || 'Не указан'}
<b>Описание:</b> ${this.description.value}
    `;

    axios.post(URL, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: message
    })
    .then((res) => {
        if (res.data.ok) {
            alert("✅ Заявка успешно отправлена!");
            this.reset();
        } else {
            throw new Error('Telegram API error');
        }
    })
    .catch((err) => {
        console.error('Ошибка отправки:', err);
        alert("❌ Ошибка при отправке. Проверьте настройки бота.");
    })
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
});