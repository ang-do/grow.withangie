(function () {
  'use strict';

  /* ---------- fixed topbar: height sync + hide-on-scroll-down nav ---------- */
  function initTopbar() {
    const bar = document.getElementById('gwa-topbar');
    const spacer = document.getElementById('gwa-topbar-spacer');
    const nav = document.getElementById('gwa-nav');
    if (!bar || !spacer || !nav) return;

    const sync = () => {
      const h = bar.offsetHeight;
      spacer.style.height = h + 'px';
      const ann = document.getElementById('gwa-announce');
      document.documentElement.style.scrollPaddingTop = ((ann ? ann.offsetHeight : 0) + 12) + 'px';
    };
    sync();
    new ResizeObserver(sync).observe(bar);
    window.addEventListener('resize', sync);

    let last = window.scrollY;
    const hideNav = () => {
      const h = nav.offsetHeight || 60;
      nav.style.transform = 'translateY(-' + (h + 2) + 'px)';
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
    };
    const showNav = () => {
      nav.style.transform = 'translateY(0)';
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    };
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const goingDown = y > last && y > 120;
      last = y;
      goingDown ? hideNav() : showNav();
      sync();
    }, { passive: true });

    // hide the nav on anchor clicks so the target always lands right under the announcement bar
    document.addEventListener('click', (ev) => {
      const a = ev.target && ev.target.closest && ev.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      hideNav();
      last = 1e9; // stay hidden until the user scrolls up again
      sync();
    }, true);
  }

  /* ---------- "what we cover" toggles on the 1:1 session cards ---------- */
  function initCoverToggles() {
    document.querySelectorAll('.cover-toggle').forEach((btn) => {
      const content = document.getElementById(btn.dataset.target);
      const sign = btn.querySelector('.cover-sign');
      if (!content || !sign) return;
      btn.addEventListener('click', () => {
        const willOpen = content.hidden;
        content.hidden = !willOpen;
        sign.textContent = willOpen ? '−' : '+';
      });
    });
  }

  /* ---------- FAQ accordion (single item open at a time) ---------- */
  function initFaq() {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (!items.length) return;
    let open = 1;

    const apply = () => {
      items.forEach((item) => {
        const idx = Number(item.dataset.faq);
        const body = item.querySelector('.faq-a');
        const sign = item.querySelector('.faq-sign');
        const isOpen = idx === open;
        body.hidden = !isOpen;
        sign.textContent = isOpen ? '−' : '+';
      });
    };
    apply();

    items.forEach((item) => {
      item.querySelector('.faq-q').addEventListener('click', () => {
        const idx = Number(item.dataset.faq);
        open = open === idx ? null : idx;
        apply();
      });
    });
  }

  /* ---------- "find my option" quiz ---------- */
  const QUIZ_QUESTIONS = [
    {
      q: 'Where does your job search break down?',
      a: [
        ['I apply and hear nothing back', 'foundation'],
        ['I get interviews but no offers', 'interview'],
        ['Honestly, everywhere — I need a full reset', 'intensive']
      ]
    },
    {
      q: 'How much support do you want from me?',
      a: [
        ['Just the tools, I will do it myself', 'self'],
        ['One focused session on my case', 'session'],
        ['Someone involved until I sign an offer', 'full']
      ]
    },
    {
      q: 'How soon do you need this fixed?',
      a: [
        ['I am starting to look, no rush', 'self'],
        ['I have interviews coming up', 'session'],
        ['I have been searching for months', 'full']
      ]
    }
  ];

  function quizResult(answers) {
    const [a1, a2] = answers;
    if (a2 === 'full') return { title: 'Full Career Partnership', text: 'You want someone involved in the whole search — strategy, applications, interviews and negotiation. 0% upfront, you pay only after you accept an offer.', cta: 'Explore Full Partnership', href: '#partnership' };
    if (a2 === 'self') return { title: 'Start with a digital product', text: 'You know what you need and want to move at your own pace. The Resume Kit and Interview Guide give you the same hiring principles in ready-to-use form.', cta: 'See the products', href: '#products' };
    if (a1 === 'intensive') return { title: 'The Intensive — $299', text: 'Positioning and interview preparation both need work. The Intensive fixes them in one concentrated 3-hour session.', cta: 'Book the Intensive', href: '#sessions' };
    if (a1 === 'interview') return { title: 'Interview Training — $119', text: 'You reach the interview stage but the conversations stall. We work on likely questions, answer structure, delivery and salary negotiation.', cta: 'Book Interview Training', href: '#sessions' };
    return { title: 'Career Foundation — $99', text: 'Something is stopping you before the interview stage. We audit your search, fix your CV and LinkedIn positioning and pick the right target market.', cta: 'Book Career Foundation', href: '#sessions' };
  }

  function initQuiz() {
    const toggleBtn = document.getElementById('quiz-toggle-btn');
    const resetBtn = document.getElementById('quiz-reset-btn');
    const panel = document.getElementById('quiz-panel');
    const arrow = document.getElementById('quiz-arrow');
    const stepLabel = document.getElementById('quiz-step-label');
    const body = document.getElementById('quiz-body');
    if (!toggleBtn || !panel) return;

    const state = { open: false, answers: [] };

    function render() {
      panel.hidden = !state.open;
      arrow.textContent = state.open ? '↑' : '↓';
      if (!state.open) return;

      const step = state.answers.length;
      if (step < QUIZ_QUESTIONS.length) {
        stepLabel.textContent = 'Question ' + (step + 1) + ' of ' + QUIZ_QUESTIONS.length;
        const q = QUIZ_QUESTIONS[step];
        body.innerHTML =
          '<h3 style="font-size:clamp(19px,2.2vw,24px);line-height:1.25;letter-spacing:-0.02em;font-weight:800;margin:0 0 18px">' + q.q + '</h3>' +
          '<div style="display:grid;gap:10px">' +
          q.a.map((opt, i) =>
            '<button type="button" class="hov-quiz-option" data-idx="' + i + '" style="width:100%;text-align:left;border:1px solid #dde2ea;background:#ffffff;color:#14161a;font-family:Manrope,sans-serif;font-size:15px;font-weight:600;line-height:1.4;padding:16px 18px;min-height:56px;border-radius:14px;cursor:pointer">' + opt[0] + '</button>'
          ).join('') +
          '</div>';
        body.querySelectorAll('button[data-idx]').forEach((btn) => {
          btn.addEventListener('click', () => {
            state.answers.push(q.a[Number(btn.dataset.idx)][1]);
            render();
          });
        });
      } else {
        stepLabel.textContent = 'Result';
        const res = quizResult(state.answers);
        body.innerHTML =
          '<p style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#2458E6;margin:0 0 10px">Your best fit</p>' +
          '<h3 style="font-size:clamp(21px,2.4vw,28px);line-height:1.2;letter-spacing:-0.02em;font-weight:800;margin:0 0 10px">' + res.title + '</h3>' +
          '<p style="font-size:15px;line-height:1.6;color:#4a5361;margin:0 0 18px">' + res.text + '</p>' +
          '<a href="' + res.href + '" class="hov-primary" style="display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 26px;border-radius:999px;background:#2458E6;color:#ffffff;font-weight:700;font-size:16px">' + res.cta + '</a>';
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (state.open) state.answers = [];
      state.open = !state.open;
      render();
    });
    resetBtn.addEventListener('click', () => {
      state.answers = [];
      render();
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTopbar();
    initCoverToggles();
    initFaq();
    initQuiz();
  });
})();
