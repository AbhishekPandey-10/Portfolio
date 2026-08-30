/**
 * THE PITCH — Abhishek Pandey Portfolio
 * Interactive Mechanics: Cursor, SVG Pitch, Card Tilt, Magnetic Buttons & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCustomCursor();
  initTiltCards();
  initMagneticButtons();
  initStatCounters();
  initScrollProgress();
});

/* ==========================================================================
   0. LIGHT & DARK MODE (MATCHDAY FLOODLIGHTS)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const currentTheme = storedTheme || 'light';
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const iconEls = document.querySelectorAll('.theme-toggle-icon');
    if (theme === 'dark') {
      iconEls.forEach(el => el.textContent = '☀️');
    } else {
      iconEls.forEach(el => el.textContent = '🌙');
    }
  }
}

window.initThemeToggle = initThemeToggle;

/* ==========================================================================
   1. CUSTOM CURSOR & KICK INTERACTION
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Expand on interactive elements
  const interactives = document.querySelectorAll('a, button, .pitch-pin, .tactics-node, .tilt-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Kick animation on click
  window.addEventListener('mousedown', () => {
    cursor.classList.add('kicking');
  });

  window.addEventListener('mouseup', () => {
    setTimeout(() => {
      cursor.classList.remove('kicking');
    }, 200);
  });
}


/* ==========================================================================
   3. THE FORMATION — TACTICAL POSITION SELECTOR
   ========================================================================== */
const tacticalRoles = {
  gk: {
    badge: 'POSITION: GK (GOALKEEPER)',
    number: '#01',
    title: 'Reliability, Safety Net & DevOps',
    desc: 'The last line of defense. Ensuring deterministic builds, clean Git workflows, robust automated CI/CD checks, and zero-downtime stability.',
    stack: ['Git & GitHub', 'DevOps Habits', 'Linux / Bash', 'VS Code', 'Automated Testing'],
  },
  def: {
    badge: 'POSITION: CB (CENTRAL DEFENDER)',
    number: '#04',
    title: 'Relational Foundations & SQL Data Architecture',
    desc: 'Uncompromising structural integrity. ACID transactions, index optimization, normalized schemas, and rock-solid relational data layers.',
    stack: ['SQL', 'MySQL', 'Database Normalization', 'Relational Schemas', 'Transaction Locks'],
  },
  mid: {
    badge: 'POSITION: CAM (PLAYMAKER)',
    number: '#10',
    title: 'Autonomous AI Agents & Multi-Agent Swarms',
    desc: 'The creative nucleus. Building multi-agent swarms with Model Context Protocol (MCP), tool-augmented sandboxes, vector embeddings, and persistent memory lattices.',
    stack: ['AI Agents', 'MCP', 'ADK', 'Google Antigravity', 'LangChain', 'Prompt Engineering'],
  },
  st: {
    badge: 'POSITION: ST (STRIKER / FINISHER)',
    number: '#09',
    title: 'High-Impact Computational Engineering',
    desc: 'Clinical problem-solving. Python, C++, Data Structures & Algorithms, and rapid conversion of complex algorithmic requirements into clean code.',
    stack: ['Python', 'C++', 'DSA', 'OOP', 'Codeforces', 'LeetCode'],
  },
  rw: {
    badge: 'POSITION: RW (TACTICAL WINGER)',
    number: '#07',
    title: 'Full-Stack Architecture & Modern Web Platforms',
    desc: 'Pace, precision, and fluid interfaces. Building high-performance, accessible web platforms that bridge complex backends with intuitive design.',
    stack: ['JavaScript', 'HTML5 & Modern CSS', 'Django / DRF', 'REST APIs', 'Glassmorphism UI'],
  },
};

function flipCard(cardEl) {
  if (!cardEl) return;
  cardEl.classList.toggle('fifa-card--flipped');
}

window.flipCard = flipCard;

// Keyboard navigation support for FIFA cards
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList.contains('fifa-card')) {
    e.preventDefault();
    flipCard(document.activeElement);
  }
});

/* ==========================================================================
   4. RESTRAINED 3D TILT CARDS (3–5° Parallax)
   ========================================================================== */
function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 4 degrees tilt
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease-out';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/* ==========================================================================
   5. MAGNETIC BUTTON EFFECT
   ========================================================================== */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Restrained pull within ~12px max
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/* ==========================================================================
   6. ANIMATED STAT COUNTERS ON VIEWPORT ENTER
   ========================================================================== */
function initStatCounters() {
  const counterCards = document.querySelectorAll('.stat-counter-card');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateNumbers();
        }
      });
    },
    { threshold: 0.3 }
  );

  counterCards.forEach((card) => observer.observe(card));

  function animateNumbers() {
    // CGPA Counter: 6.00 -> 8.76
    const cgpaEl = document.getElementById('stat-cgpa');
    if (cgpaEl) animateValue(cgpaEl, 6.0, 8.76, 1200, 2);

    // Commits in 2026: 0 -> 82
    const commitsEl = document.getElementById('stat-commits');
    if (commitsEl) animateValue(commitsEl, 0, 82, 1200, 0);

    // Public Repos: 0 -> 11
    const reposEl = document.getElementById('stat-repos');
    if (reposEl) animateValue(reposEl, 0, 11, 1000, 0);

    // Total Stars: 0 -> 7
    const starsEl = document.getElementById('stat-stars');
    if (starsEl) animateValue(starsEl, 0, 7, 1000, 0, '', '★ ');

    // Hackathons Captained: 0 -> 3+
    const hackEl = document.getElementById('stat-hackathons');
    if (hackEl) animateValue(hackEl, 0, 3, 1000, 0, '+');

    // Live Organic Users: 0 -> 68
    const usersEl = document.getElementById('stat-users');
    if (usersEl) animateValue(usersEl, 0, 68, 1200, 0);
  }

  function animateValue(el, start, end, duration, decimals = 0, suffix = '', prefix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * easeProgress;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   7. TACTICS BOARD NODE HIGHLIGHTING
   ========================================================================== */
function highlightNode(nodeName) {
  const lines = document.querySelectorAll('.tactics-link-line');
  lines.forEach((line) => {
    const nodes = (line.getAttribute('data-nodes') || '').split(',');
    if (!nodeName || nodes.includes(nodeName)) {
      line.classList.add('active');
    } else {
      line.classList.remove('active');
    }
  });
}

function resetHighlight() {
  const lines = document.querySelectorAll('.tactics-link-line');
  lines.forEach((line) => line.classList.remove('active'));
}

window.highlightNode = highlightNode;
window.resetHighlight = resetHighlight;

/* ==========================================================================
   8. TOAST NOTIFICATION & COPY CONTACT
   ========================================================================== */
function copyContact(text, label) {
  navigator.clipboard.writeText(text).then(
    () => {
      showToast(`✓ ${label} copied to clipboard: ${text}`);
    },
    () => {
      showToast(`Tactical coordinate: ${text}`);
    }
  );
}

function showToast(message) {
  const toast = document.getElementById('pitchToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

window.copyContact = copyContact;
window.showToast = showToast;

/* ==========================================================================
   8. TOP SCROLL PROGRESS INDICATOR BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

window.initScrollProgress = initScrollProgress;

