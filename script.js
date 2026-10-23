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

  // Featured applications (highest priority showcase)
  const FEATURED_PROJECTS = [
    {
      name: 'Stockpoint',
      tagline: 'Retail & POS',
      fallbackDesc: 'Offline-first desktop POS & inventory system for retail shops and groceries, featuring barcode scanning, sales audit trails, and local SQLite data management.',
      lang: 'Electron / TypeScript'
    },
    {
      name: 'VisuaLive',
      tagline: 'AI & Biometrics',
      fallbackDesc: 'Local-first, GPU-accelerated face detection and recognition system via WebSocket, ONNX Runtime (SCRFD/ArcFace), and SQL Server dataset management.',
      lang: 'Python'
    },
    {
      name: 'SigniaMAXX',
      tagline: 'Accessibility & AI',
      fallbackDesc: 'Real-time American Sign Language (ASL) fingerspelling recognizer converting webcam hand signs (A–Z, 0–9) into live text using deep learning.',
      lang: 'Next.js / Python'
    },
    {
      name: 'FocusBoard',
      tagline: 'Productivity',
      fallbackDesc: 'Minimalist, high-performance personal productivity dashboard with task prioritization, smart filters, live search, and zero-config deployment.',
      lang: 'TypeScript'
    },
    {
      name: 'Recognizant',
      tagline: 'Computer Vision',
      fallbackDesc: 'Fully offline computer vision suite for facial biometric login, color/shape similar-image search, and automatic image analysis without external APIs.',
      lang: 'Python'
    },
    {
      name: 'SSMS-Connect',
      tagline: 'Developer Tooling',
      fallbackDesc: 'Dynamic web workspace interface for Microsoft SQL Server enabling schema design, table definitions, and complete CRUD record operations.',
      lang: 'Python / Flask'
    }
  ];

  // Keywords & terms that indicate a problem-solving, real-world utility application
  const PROBLEM_SOLVER_KEYWORDS = [
    // Real-world domains
    'pos', 'point-of-sale', 'inventory', 'retail', 'management', 'system',
    'accessibility', 'asl', 'sign-language', 'interpreter', 'recognition',
    'biometric', 'detection', 'face-recognition', 'computer-vision', 'vision',
    'productivity', 'dashboard', 'task', 'workflow', 'automation', 'finance',
    'tracker', 'analytics', 'database', 'crud', 'workspace', 'health', 'tool',
    'utility', 'security', 'optimizer', 'converter', 'api', 'iot', 'offline-first',
    'ai', 'deep-learning', 'machine-learning', 'embedded', 'scanner', 'service',
    'platform', 'solver', 'solution', 'assistant', 'monitor', 'engine', 'audit'
  ];

  // Specific topics or repo flags that indicate a problem-solver
  const PROBLEM_SOLVER_TOPICS = new Set([
    'problem-solver', 'utility', 'tool', 'productivity', 'accessibility',
    'pos', 'inventory', 'computer-vision', 'ai', 'database', 'system', 'app',
    'automation', 'dashboard', 'management', 'software'
  ]);

  // Exclude trivial / non-application repositories
  const EXCLUDED_REPOS = new Set([
    'zereforuto',
    'portfolio',
    'ssms-first-trial'
  ]);

  /**
   * Evaluates if a newly discovered repository meets the problem-solving criteria.
   * Looks at repo topics, description, name, and size.
   */
  function evaluateProblemSolver(repo) {
    if (!repo || repo.fork) return null;
    const nameLower = (repo.name || '').toLowerCase();
    if (EXCLUDED_REPOS.has(nameLower)) return null;

    let score = 0;
    const matchedReasons = [];

    // 1. Explicit topic tags on GitHub
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    topics.forEach(t => {
      if (PROBLEM_SOLVER_TOPICS.has(t)) {
        score += 3;
        matchedReasons.push(t);
      }
    });

    // 2. Analyze repo description and name for utility/problem-solving intent
    const textCorpus = `${repo.name || ''} ${repo.description || ''}`.toLowerCase();
    PROBLEM_SOLVER_KEYWORDS.forEach(kw => {
      // Regex word-boundary or substring match
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(textCorpus)) {
        score += 2;
        if (!matchedReasons.includes(kw)) matchedReasons.push(kw);
      }
    });

    // 3. Minimum substance check (has description or reasonable size/language)
    if (repo.description && repo.description.trim().length > 15) {
      score += 1;
    }
    if (repo.has_pages || (repo.homepage && repo.homepage.trim().length > 0)) {
      score += 1;
    }

    // Require a qualifying score threshold to be categorized as a featured project
    if (score >= 3) {
      // Generate clean contextual category from matched reasons
      const primaryReason = matchedReasons[0] || 'Software';
      const formattedReason = primaryReason
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      return {
        isProblemSolver: true,
        tagline: formattedReason,
        score: score
      };
    }

    return null;
  }

  async function fetchRepos() {
    try {
      const res = await fetch(API_URL, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('GitHub API unavailable, using curated portfolio data:', e);
      return [];
    }
  }

  function renderLoading() {
    grid.innerHTML = `
      <div class="projects-state projects-state--loading" role="status" aria-live="polite">
        <div class="loader" aria-hidden="true"></div>
        <p>Loading projects…</p>
      </div>`;
  }

  function renderCards(apiRepos) {
    // Build a map of live repo data by lowercase name
    const repoMap = new Map();
    apiRepos.forEach(repo => {
      if (repo && repo.name) {
        repoMap.set(repo.name.toLowerCase(), repo);
      }
    });

    // 1. Initial curated problem-solver projects with live updates
    const displayList = FEATURED_PROJECTS.map(f => {
      const live = repoMap.get(f.name.toLowerCase());
      return {
        name: f.name,
        tagline: f.tagline,
        url: live ? live.html_url : `https://github.com/zereforuto/${f.name}`,
        description: (live && live.description) ? live.description : f.fallbackDesc,
        language: f.lang || (live ? live.language : 'Code'),
        stars: live ? live.stargazers_count : 0,
        forks: live ? live.forks_count : 0,
        priority: 100 // Featured baseline
      };
    });

    // 2. Automatically test any newly added repositories on your GitHub against the criteria
    const newQualifyingRepos = [];
    apiRepos.forEach(repo => {
      const nameLower = (repo.name || '').toLowerCase();
      const alreadyIncluded = FEATURED_PROJECTS.some(f => f.name.toLowerCase() === nameLower);

      if (!alreadyIncluded && !repo.fork && !EXCLUDED_REPOS.has(nameLower)) {
        const evaluation = evaluateProblemSolver(repo);
        // Only include if it meets the problem solver criteria
        if (evaluation && evaluation.isProblemSolver) {
          newQualifyingRepos.push({
            name: repo.name,
            tagline: evaluation.tagline,
            url: repo.html_url,
            description: repo.description || 'Problem-solving open-source project on GitHub.',
            language: repo.language || 'Code',
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            priority: evaluation.score
          });
        }
      }
    });

    // Sort newly discovered problem solvers by score/stars and add to showcase
    newQualifyingRepos.sort((a, b) => b.priority - a.priority || b.stars - a.stars);
    displayList.push(...newQualifyingRepos);

    grid.innerHTML = displayList.map((item, i) => {
      const delay = (i % 3) + 1;
      return `
        <article class="project-card" data-reveal data-delay="${delay}">
          <div class="project-card-top">
            <div>
              <span class="project-tagline">${escapeHtml(item.tagline)}</span>
              <h3 class="project-name">${escapeHtml(item.name)}</h3>
            </div>
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"
               class="project-link-btn"
               aria-label="View ${escapeHtml(item.name)} repository on GitHub">
              <svg class="project-link-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
          <p class="project-desc">${escapeHtml(item.description)}</p>
          <div class="project-meta">
            <span class="project-lang">
              <span class="lang-dot" data-lang="${escapeHtml(item.language)}" aria-hidden="true"></span>
              ${escapeHtml(item.language)}
            </span>
            ${item.stars > 0 ? `
            <span class="project-stat" title="Stars">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              ${item.stars}
            </span>` : ''}
          </div>
        </article>`;
    }).join('');

    // Re-observe newly rendered cards for animations
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
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderLoading();
  fetchRepos()
    .then(repos => renderCards(repos))
    .catch(() => renderCards([]));
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
