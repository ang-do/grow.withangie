// ---- keep the sticky nav glued to the bottom of the fixed banner ----
function syncBannerHeight() {
  const banner = document.querySelector('.banner');
  if (!banner) return;
  document.documentElement.style.setProperty('--banner-h', banner.offsetHeight + 'px');
}
window.addEventListener('resize', syncBannerHeight);
window.addEventListener('load', syncBannerHeight);
syncBannerHeight();

// ---- match hero photo height to the text column (top: eyebrow, bottom: disclaimer) ----
function syncHeroPhotoHeight() {
  const top = document.querySelector('.eyebrow');
  const bottom = document.querySelector('.hero__disclaimer');
  const media = document.querySelector('.hero__media');
  if (!top || !bottom || !media) return;
  if (window.innerWidth <= 980) {
    media.style.height = '';
    return;
  }
  const height = bottom.getBoundingClientRect().bottom - top.getBoundingClientRect().top;
  media.style.height = height + 'px';
}
window.addEventListener('resize', syncHeroPhotoHeight);
window.addEventListener('load', syncHeroPhotoHeight);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(syncHeroPhotoHeight);
}
syncHeroPhotoHeight();

// ---- mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navLinksMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- FAQ accordion (single-open, first item open by default) ----
const faqs = [
  {
    q: "What's the difference between the products and the sessions?",
    a: "The products (Resume Kit, Interview Kit) are self-serve templates and guides you use on your own. The sessions are live 1:1 time with me, tailored to your specific background and role."
  },
  {
    q: "I don't have interviews lined up yet. Where should I start?",
    a: "Start with the Career Foundation Consultation will save lots of your time (the Resume Kit is also included). The expert will guide you through the key points so you don't waste your time. Once your resume and LinkedIn are working, move to the Interview Kit or Interview Training as the calls start coming in (or get a shorter Follow-Up Consultation to be sure everything is ready to be seen by your future Employer)."
  },
  {
    q: 'How long does my Career Bundle discount code last?',
    a: "14 days from the day you receive it."
  },
  {
    q: 'How do I know these materials are right for me?',
    a: "Both kits include recommendations broken out by category and location, so what you get is guidance relevant to your specific market, not generic advice."
  },
  {
    q: 'Can I book both 1-hour sessions?',
    a: 'Yes! Go with both for $180 instead of $198, and leave with a rebuilt resume, LinkedIn, Clear Job Search Strategy, and an full readiness to pass the interviews.'
  },
  {
    q: 'How does the no-prepayment partnership work?',
    a: "No cost upfront. You pay 10% of your first three salaries only after you accept an offer, so the incentive is fully aligned with getting you hired. We will guide you through all the hiring process at every stage until you sign your dream offer."
  },
  {
    q: 'What locations do you work with?',
    a: "We work with specialists and companies all over the world: EMEA, ASEAN, the US, LATAM - we will help you to choose the one fitting your requirements. The strategy and materials are adapted to your target market, whether that's US, EU, or elsewhere.\nAnd the most common option is REMOTE, where we get the best salary for you."
  },
  {
    q: "I don't know what I'm looking for. Either location or position type. Does your service fit me?",
    a: "Yes — that's exactly where most clients start. The Career Foundation session and the Follow-up Consultation both include guidance on choosing your target location, profession, market, and role type, so you leave with real direction, not just a rebuilt resume."
  }
];

let openFaq = 0;
const faqGrid = document.getElementById('faqGrid');

function renderFaqs() {
  faqGrid.innerHTML = '';
  faqs.forEach((item, i) => {
    const isOpen = openFaq === i;

    const wrap = document.createElement('div');
    wrap.className = 'faq-item';

    const btn = document.createElement('button');
    btn.className = 'faq-item__q';
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.innerHTML = `
      <span class="faq-item__q-text">${item.q}</span>
      <span class="faq-item__sign">${isOpen ? '–' : '+'}</span>
    `;
    btn.addEventListener('click', () => {
      openFaq = isOpen ? null : i;
      renderFaqs();
    });
    wrap.appendChild(btn);

    if (isOpen) {
      const ans = document.createElement('div');
      ans.className = 'faq-item__a';
      ans.textContent = item.a;
      wrap.appendChild(ans);
    }

    faqGrid.appendChild(wrap);
  });
}
renderFaqs();

// ---- contact form: opens the visitor's email client, no backend ----
const contactForm = document.getElementById('contactForm');
const contactThanks = document.getElementById('contactThanks');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const message = document.getElementById('cf-message').value;

  const subject = encodeURIComponent('New inquiry from grow.withangie');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:angelina@unatalent.com?subject=${subject}&body=${body}`;

  contactForm.hidden = true;
  contactThanks.hidden = false;
});
