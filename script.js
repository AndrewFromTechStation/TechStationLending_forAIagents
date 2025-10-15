document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  const navLinks = document.querySelectorAll('.main-nav a');
  const scrollButtons = document.querySelectorAll('a[href^="#"], [data-scroll]');
  const caseCards = document.querySelectorAll('.case-card');
  const form = document.querySelector('.contact-form');
  const responseMessage = document.querySelector('.response-message');
  const consentCheckbox = document.getElementById('consent');
  const emailField = document.getElementById('email');
  const stickyCta = document.querySelector('.sticky-cta');

  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  const applyStickyHeader = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  applyStickyHeader();
  window.addEventListener('scroll', applyStickyHeader);

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navList?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (!element) return;
    const headerOffset = header.offsetHeight + 12;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  scrollButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const targetId = btn.dataset.scroll || btn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        event.preventDefault();
        smoothScroll(targetId);
      }
    });
  });

  const sectionElements = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);
        if (!navLink) return;
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.1
    }
  );

  sectionElements.forEach((section) => observer.observe(section));

  caseCards.forEach((card) => {
    const toggle = card.querySelector('.toggle-case');
    toggle?.addEventListener('click', () => {
      const expanded = card.getAttribute('data-expanded') === 'true';
      card.setAttribute('data-expanded', String(!expanded));
      toggle.textContent = expanded ? 'Смотреть детали' : 'Скрыть детали';
    });
  });

  const populateUtmFields = () => {
    const params = new URLSearchParams(window.location.search);
    let shouldPersist = false;

    utmFields.forEach((field) => {
      if (params.has(field)) {
        const value = params.get(field) || '';
        localStorage.setItem(field, value);
        shouldPersist = true;
      }
    });

    utmFields.forEach((field) => {
      const storedValue = localStorage.getItem(field) || '';
      const input = document.getElementById(field);
      if (input) {
        input.value = storedValue;
      }
    });

    return shouldPersist;
  };

  populateUtmFields();

  const showMessage = (message, type = 'success') => {
    if (!responseMessage) return;
    responseMessage.textContent = message;
    responseMessage.classList.remove('error', 'success');
    responseMessage.classList.add(type);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    responseMessage?.classList.remove('error', 'success');

    const emailValid = validateEmail(emailField.value.trim());
    const consentGiven = consentCheckbox.checked;

    if (!emailValid) {
      showMessage('Укажите корректный e-mail, чтобы мы ответили.', 'error');
      emailField.focus();
      return;
    }

    if (!consentGiven) {
      showMessage('Подтвердите согласие на обработку данных.', 'error');
      consentCheckbox.focus();
      return;
    }

    showMessage('Спасибо! Заявка сохранена, свяжемся в рабочее время.', 'success');
    form.reset();
    populateUtmFields();
  });

  const toggleStickyCta = () => {
    if (!stickyCta) return;
    if (window.scrollY > 400) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
  };

  toggleStickyCta();
  window.addEventListener('scroll', toggleStickyCta);
});
