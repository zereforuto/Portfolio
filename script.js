/* ============================================================
   script.js — Portfolio: Jayzer Relator
   Plain vanilla JS, no build step
   ============================================================ */

'use strict';

/* ---- NAV: hamburger toggle ---- */
(function initNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('is-open', !expanded);
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    }
  });
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Immediately show everything
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();

/* ---- GITHUB PROJECTS ---- */
(function initProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const API_URL = 'https://api.github.com/users/zereforuto/repos?per_page=100&sort=updated&type=owner';

  async function fetchRepos() {
    const res = await fetch(API_URL, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const data = await res.json();
    // Filter forks, sort by pushed_at desc, limit 9
    return data
      .filter(r => !r.fork)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 9);
  }

  function renderLoading() {
    grid.innerHTML = `
      <div class="projects-state projects-state--loading" role="status" aria-live="polite">
        <div class="loader" aria-hidden="true"></div>
        <p>Fetching repositories…</p>
      </div>`;
  }

  function renderError() {
    grid.innerHTML = `
      <div class="projects-state projects-state--error" role="alert">
        <p>Could not load repositories. Check your connection or <a href="https://github.com/zereforuto?tab=repositories" target="_blank" rel="noopener noreferrer">view on GitHub →</a></p>
      </div>`;
  }

  function renderEmpty() {
    grid.innerHTML = `
      <div class="projects-state" role="status">
        <p>No public repositories found yet. <a href="https://github.com/zereforuto" target="_blank" rel="noopener noreferrer">Visit GitHub →</a></p>
      </div>`;
  }

  function renderCards(repos) {
    if (repos.length === 0) { renderEmpty(); return; }

    grid.innerHTML = repos.map((repo, i) => {
      const lang = repo.language || '';
      const desc = repo.description
        ? escapeHtml(repo.description)
        : '<em style="color:#999">No description</em>';
      const delay = (i % 3) + 1;

      return `
        <article class="project-card" data-reveal data-delay="${delay}">
          <div class="project-card-top">
            <h3 class="project-name">${escapeHtml(repo.name)}</h3>
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer"
               aria-label="View ${escapeHtml(repo.name)} on GitHub">
              <svg class="project-link-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
          <p class="project-desc">${desc}</p>
          <div class="project-meta">
            ${lang ? `
            <span class="project-lang">
              <span class="lang-dot" data-lang="${escapeHtml(lang)}" aria-hidden="true"></span>
              ${escapeHtml(lang)}
            </span>` : ''}
          </div>
        </article>`;
    }).join('');

    // Re-observe newly rendered cards
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      grid.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    } else {
      grid.querySelectorAll('[data-reveal]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderLoading();
  fetchRepos()
    .then(renderCards)
    .catch(() => renderError());
})();

/* ---- NAV ACTIVE LINK on scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.setAttribute('aria-current', 'page');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
})();
