function scrollToAbout(sectionId) {
    // Если ID не передан, используем значение по умолчанию
    const targetId = sectionId || 'about_pr_1';
    const element = document.getElementById(targetId);
    
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.pr_preview_1');
    
    if (hero && window.innerWidth > 768) {
        const speed = 0.5;
        hero.style.backgroundPositionY = `calc(50% + ${scrolled * speed}px)`;
    }
});

// Mouse movement effect for hero section (desktop only)
if (window.innerWidth > 1024) {
    const hero = document.querySelector('.pr_preview_1');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            hero.style.backgroundPosition = `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`;
        });
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, observerOptions);

// Observe elements for animation reset
document.querySelectorAll('.about_item_pr_1').forEach(el => {
    observer.observe(el);
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
<b>Новая заявка с проектной страницы!</b>
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