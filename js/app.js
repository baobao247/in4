(function() {
    'use strict';

    // 1. Dark/Light Mode Management with LocalStorage
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('vibe_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', nextTheme);
            localStorage.setItem('vibe_theme', nextTheme);
            updateThemeIcon(nextTheme);
        });
    }

    function updateThemeIcon(t) {
        if (!themeBtn) return;
        const icon = themeBtn.querySelector('i');
        if (!icon) return;
        if (t === 'dark') {
            icon.className = 'fas fa-sun';
            icon.style.color = '#f59e0b';
        } else {
            icon.className = 'fas fa-moon';
            icon.style.color = 'inherit';
        }
    }

    // 2. Email Copy with Toast
    const copyBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('copyToast');
    if (copyBtn && toast) {
        copyBtn.addEventListener('click', function() {
            const email = copyBtn.getAttribute('data-email') || 'zsbao40@gmail.com';
            navigator.clipboard.writeText(email).then(function() {
                toast.classList.add('show');
                setTimeout(function() { toast.classList.remove('show'); }, 2200);
            }).catch(function() {
                window.location.href = 'mailto:' + email;
            });
        });
    }

    // 3. View Switcher: Projects vs Individual
    const tabProjects = document.getElementById('viewTabProjects');
    const tabIndividual = document.getElementById('viewTabIndividual');
    const sectionProjects = document.getElementById('sectionProjects');
    const sectionIndividual = document.getElementById('sectionIndividual');

    function switchView(viewName, updateHash) {
        if (viewName === 'individual') {
            if (tabProjects) {
                tabProjects.classList.remove('active');
                tabProjects.setAttribute('aria-selected', 'false');
            }
            if (tabIndividual) {
                tabIndividual.classList.add('active');
                tabIndividual.setAttribute('aria-selected', 'true');
            }
            if (sectionProjects) sectionProjects.classList.remove('active');
            if (sectionIndividual) sectionIndividual.classList.add('active');
            if (updateHash) location.hash = '#individual';
        } else {
            if (tabIndividual) {
                tabIndividual.classList.remove('active');
                tabIndividual.setAttribute('aria-selected', 'false');
            }
            if (tabProjects) {
                tabProjects.classList.add('active');
                tabProjects.setAttribute('aria-selected', 'true');
            }
            if (sectionIndividual) sectionIndividual.classList.remove('active');
            if (sectionProjects) sectionProjects.classList.add('active');
            if (updateHash) location.hash = '#project';
        }
    }

    if (tabProjects) {
        tabProjects.addEventListener('click', function() {
            switchView('project', true);
        });
    }
    if (tabIndividual) {
        tabIndividual.addEventListener('click', function() {
            switchView('individual', true);
        });
    }

    // Sync view with URL hash
    function handleHash() {
        const hash = location.hash.toLowerCase();
        if (hash === '#individual' || hash === '#memories' || hash === '#bday') {
            switchView('individual', false);
        } else {
            switchView('project', false);
        }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();

    // 4. Category Filter & Live Search Algorithm (Projects View)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const cards = document.querySelectorAll('#projectGrid .project-card');
    const emptyMsg = document.getElementById('emptyMsg');
    const counterBadge = document.getElementById('badgeProjectCount');
    let activeCategory = 'all';

    function filterProjects() {
        if (!searchInput) return;
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        if (clearSearchBtn) {
            clearSearchBtn.style.display = query ? 'block' : 'none';
        }

        cards.forEach(function(card) {
            const category = card.getAttribute('data-category');
            const title = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
            const desc = (card.querySelector('.project-desc') ? card.querySelector('.project-desc').textContent : '').toLowerCase();
            const tags = (card.querySelector('.tool-tags') ? card.querySelector('.tool-tags').textContent : '').toLowerCase();

            const matchesCategory = (activeCategory === 'all' || category === activeCategory);
            const matchesQuery = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Display empty state if needed
        if (emptyMsg) {
            emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Count display: +1 for Flagship Fwrt when all or tools is selected
        if (counterBadge) {
            const extra = (activeCategory === 'all' || activeCategory === 'tools') ? 1 : 0;
            counterBadge.textContent = visibleCount + extra;
        }
    }

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category') || 'all';
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                filterProjects();
            }
        });
    }

    // Keyboard shortcut: '/' focuses search input
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput && (!tabProjects || tabProjects.classList.contains('active'))) {
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        } else if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            filterProjects();
            searchInput.blur();
        }
    });

    // 5. Scroll Reveal (IntersectionObserver)
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduced) {
        const io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealEls.forEach(function(el) { io.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('in-view'); });
    }

    // 6. Back to Top Button
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', function() {
            btt.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        btt.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    }

    // 7. Local File / Localhost Link Rewriter
    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
        document.querySelectorAll('a[href^="https://baobao247.github.io/"]').forEach(function(a) {
            const m = a.href.match(/https:\/\/baobao247\.github\.io\/([^\/]+)\/?/);
            if (m && m[1]) {
                a.href = '../' + m[1] + '/index.html';
                a.title = (a.title || '') + ' (Mở phiên bản cục bộ)';
            }
        });
    }
})();
