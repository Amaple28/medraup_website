document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const contactForm = document.getElementById('contactForm');

    // ── Scroll-to-top button ──
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.type = 'button';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // ── Mobile menu helpers ──
    const closeMobileMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        document.body.classList.remove('menu-open');
    };
    const toggleMobileMenu = () => {
        if (!hamburger || !mobileMenu) return;
        const open = hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(open));
        mobileMenu.hidden = !open;
        document.body.classList.toggle('menu-open', open);
    };
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

    // ── Smooth scroll for all anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Navbar scroll state ──
    const handleScroll = () => {
        const scrolled = window.scrollY > 24;
        navbar?.classList.toggle('scrolled', scrolled);
        scrollTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Scroll to top ──
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── AOS init ──
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 72 });
    }

    // ── Toast notification ──
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);
        window.setTimeout(() => {
            toast.classList.add('hide');
            window.setTimeout(() => toast.remove(), 280);
        }, 3000);
    };

    // ── Contact form → WhatsApp ──
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('name')?.value.trim();
            const email   = document.getElementById('email')?.value.trim();
            const company = document.getElementById('company')?.value.trim();
            const service = document.getElementById('service')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!name || !email || !company || !service || !message) {
                showToast('Preencha todos os campos para continuar.', 'error');
                return;
            }

            // ⚠️ SUBSTITUA pelo número real antes de publicar
            const whatsappNumber = '5531982917401';

            const whatsappMessage = [
                '👋 Olá! Gostaria de iniciar um atendimento pela MedraUp.',
                '',
                `📋 *Dados do contato*`,
                `• Nome: ${name}`,
                `• Email: ${email}`,
                `• Empresa ou projeto: ${company}`,
                `• Serviço de interesse: ${service}`,
                '',
                `💬 *Mensagem:*`,
                message
            ].join('\n');

            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            showToast('Abrindo conversa no WhatsApp…', 'success');
            contactForm.reset();
        });
    }

    // ── Active nav link on scroll ──
    const sections = [...document.querySelectorAll('section[id]')];
    const updateActiveLink = () => {
        const current = sections.find(s => {
            const rect = s.getBoundingClientRect();
            return rect.top <= 120 && rect.bottom >= 120;
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href?.startsWith('#')) return;
            link.classList.toggle('active', Boolean(current) && href === `#${current.id}`);
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ── Fix for hidden mobile menu ──
    const style = document.createElement('style');
    style.textContent = `.mobile-menu[hidden] { display: none !important; }`;
    document.head.appendChild(style);
});

// ── Escape key closes mobile menu ──
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
});
