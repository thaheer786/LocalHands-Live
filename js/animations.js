/**
 * Local Hands Global Animations & Micro-Interactions Engine
 */
const AppAnimations = {
  init() {
    this.createProgressBar();
    this.createBackToTopButton();
    this.initScrollReveal();
    this.initCounterAnimations();
    this.initCardTilt();
    this.bindScrollEvents();
  },

  createProgressBar() {
    if (!document.getElementById('scroll-progress-bar')) {
      const bar = document.createElement('div');
      bar.id = 'scroll-progress-bar';
      document.body.appendChild(bar);
    }
  },

  createBackToTopButton() {
    if (!document.getElementById('back-to-top-btn')) {
      const btn = document.createElement('button');
      btn.id = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.appendChild(btn);
    }
  },

  bindScrollEvents() {
    window.addEventListener('scroll', () => {
      // 1. Update Scroll Progress Bar Width
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      const bar = document.getElementById('scroll-progress-bar');
      if (bar) {
        bar.style.width = `${progress}%`;
      }

      // 2. Toggle Back-to-Top Button Visibility
      const topBtn = document.getElementById('back-to-top-btn');
      if (topBtn) {
        if (scrollTop > 350) {
          topBtn.classList.add('visible');
        } else {
          topBtn.classList.remove('visible');
        }
      }
    }, { passive: true });
  },

  initScrollReveal() {
    // Automatically target section components, cards, and headings for reveal
    const targetSelectors = [
      '.premium-cat-card',
      '.why-card',
      '.cat-service-card-v2',
      '.sd-provider-card',
      '.testimonial-card',
      '.cat-block-section',
      '.cust-card',
      '.prov-card',
      '.prov-stat-card',
      '.why-section',
      '.faq-section',
      '.premium-categories-header'
    ];

    targetSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
          if (index % 4 === 1) el.classList.add('stagger-1');
          if (index % 4 === 2) el.classList.add('stagger-2');
          if (index % 4 === 3) el.classList.add('stagger-3');
        }
      });
    });

    // Create IntersectionObserver for viewport reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll, .reveal-fade-in, .reveal-zoom-in').forEach(el => {
      observer.observe(el);
    });
  },

  initCounterAnimations() {
    const counterElements = document.querySelectorAll('.cust-stat-val, #prov-stat-jobs');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.innerText, 10);
          if (!isNaN(target) && target > 0 && !el.dataset.animated) {
            el.dataset.animated = 'true';
            this.animateCounter(el, target);
          }
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));
  },

  animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.innerText = target;
        clearInterval(timer);
      } else {
        el.innerText = current;
      }
    }, 40);
  },

  initCardTilt() {
    const cards = document.querySelectorAll('.premium-cat-card, .cat-service-card-v2, .why-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / (rect.height / 2)) * -4;
        const tiltY = (x / (rect.width / 2)) * 4;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AppAnimations.init();
});

window.AppAnimations = AppAnimations;
