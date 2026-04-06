(function setDate () {
    const el = document.getElementById('today-date');
    if (!el) return;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('pt-BR', options);

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = now.getFullYear();
}) ();

(function navSpy() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id], div.section-divider + section[id]');

    const allSections = Array.from(document.querySelectorAll('[id]'))
    .filter(el => ['sobre', 'reportagens', 'contato'].includes(el.id));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navItems.forEach(n => n.classList.remove('active'));
                    const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    allSections.forEach(s => observer.observe(s));
})();

(function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    
    const animate = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        let start = null;
    
        function step(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + (target >= 100 ? '+' : '');
        }
 
        requestAnimationFrame(step);
    };
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
 
  counters.forEach(c => observer.observe(c));
})();
 
 
(function scrollReveal() {
    const targets = [
        '.card',
        '.premio-item',
        '.tl-item',
        '.stat-block',
        '.cover-deck',
        '.cover-byline',
        '.midia-intro',
        '.logo-item',
        '.contato-text',
        '.contato-form-wrap',
    ];

    targets.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 6) * 80}ms`;
        });
    });
 
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                e.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
 
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

(function filterTabs() {
        const buttons = document.querySelectorAll('.filter-btn');
        const cards   = document.querySelectorAll('.reportagens-grid .card');
 
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                card.classList.remove('hidden');
                setTimeout(() => card.classList.add('visible'), 20);
                } else {
                card.classList.add('hidden');
                }
            });

            const featureCard = document.querySelector('.card--feature');
            if (featureCard && !featureCard.classList.contains('hidden')) {
                featureCard.style.gridColumn = '';
            } else if (featureCard) {
                featureCard.style.gridColumn = '1';
            }
        });
    });
})();

(function tickerLoop() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
})();

(function headlineHover() {
    document.querySelectorAll('.card-headline').forEach(h => {
        h.addEventListener('mouseenter', function () {
            this.style.textDecoration = 'underline';
            this.style.textDecorationThickness = '2px';
            this.style.textUnderlineOffset = '3px';
            this.style.textDecorationColor = 'var(--red)';
        });
        h.addEventListener('mouseleave', function () {
            this.style.textDecoration = '';
        });
    });
})();

(function customCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
 
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--red, #c0392b);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s, opacity 0.3s;
        mix-blend-mode: multiply;
        border-radius: 0;
        rotate: 45deg;
    `;
    document.body.appendChild(cursor);
 
    const ring = document.createElement('div');
    ring.style.cssText = `
        position: fixed;
        width: 24px;
        height: 24px;
        border: 1.5px solid var(--red, #c0392b);
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: transform 0.18s ease, width 0.2s, height 0.2s;
        border-radius: 0;
        rotate: 45deg;
    `;
    document.body.appendChild(ring);
 
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX; 
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    });
    
    function lerp(a, b, t) {return a + (b - a) * t;}

    (function animateRing() {
        rx = lerp(rx, mx, 0.12);
        ry = lerp(ry, my, 0.12);
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animateRing);
    }) ();

    document.querySelectorAll('a, button, .card, .filter-btn').forEach(el => {

        el.addEventListener('mouseenter', () => {
            ring.style.width  = '36px';
            ring.style.height = '36px';
        });

        el.addEventListener('mouseleave', () => {
            ring.style.width  = '24px';
            ring.style.height = '24px';
        });

    });
})();

document.querySelectorAll('.nav-item[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

(function stickyMasthead() {
    const masthead = document.querySelector('.masthead');
    const magName  = document.querySelector('.magazine-name');
    if (!masthead || !magName) return;
 
    const onScroll = () => {
        if (window.scrollY > 80) {
            masthead.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
        } else {
            masthead.style.boxShadow = '';
        }
    };
 
    window.addEventListener('scroll', onScroll, { passive: true });
})();

(function progressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        height: 3px;
        width: 0%;
        background: var(--red, #c0392b);
        z-index: 10000;
        transition: width 0.1s linear;
    `;
    document.body.appendChild(bar);
 
    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.body.scrollHeight - window.innerHeight;
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = pct + '%';
    }, { passive: true });
})();