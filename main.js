/**
 * Northfield Medical Center — Main Script
 * Handles navigation, animations, FAQ, form validation & modal.
 */
(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------- Icons ---------------- */
  if (window.lucide) window.lucide.createIcons();

  /* ---------------- Footer year ---------------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------- Sticky header + back to top ---------------- */
  const header = $('#site-header');
  const backToTop = $('#back-to-top');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 10);
    backToTop?.classList.toggle('is-visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');

  if (menuBtn && mobileMenu) {
    const setMenu = (open) => {
      mobileMenu.classList.toggle('hidden', !open);
      menuBtn.setAttribute('aria-expanded', String(open));
      $('[data-icon-open]', menuBtn).classList.toggle('hidden', open);
      $('[data-icon-close]', menuBtn).classList.toggle('hidden', !open);
    };

    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = $$('[data-count]');
  const numberFmt = new Intl.NumberFormat('en-US');

  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = numberFmt.format(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = numberFmt.format(el.dataset.count) + (el.dataset.suffix || '')));
  }

  /* ---------------- FAQ accordion ---------------- */
  $$('[data-faq-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');

      $$('.faq-item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        $('[data-faq-trigger]', openItem).setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Newsletter ---------------- */
  $$('[data-newsletter]').forEach((form) => {
    const msg = form.parentElement.querySelector('[data-newsletter-msg]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      msg.classList.remove('hidden');
      msg.textContent = valid ? '✓ Thanks for subscribing!' : 'Please enter a valid email address.';
      msg.className = `mt-2 text-sm ${valid ? 'text-mint-400' : 'text-red-400'}`;
      if (valid) form.reset();
    });
  });

  /* ---------------- Appointment form ---------------- */
  const form = $('#appointment-form');
  if (form) initAppointmentForm(form);

  function initAppointmentForm(form) {
    const DOCTORS = {
      general:     ['Dr. Olivia Grant', 'Dr. Samuel Reyes'],
      cardiology:  ['Dr. Sarah Mitchell', 'Dr. Daniel Okafor'],
      neurology:   ['Dr. James Carter', 'Dr. Priya Raman'],
      pediatrics:  ['Dr. Emily Chen', 'Dr. Lucas Romero'],
      orthopedics: ['Dr. Michael Brooks', 'Dr. Hannah Weiss'],
      oncology:    ['Dr. Aisha Bello', 'Dr. Robert Hayes'],
      diagnostics: ['Dr. Kevin Park', 'Dr. Laura Novak'],
    };

    const { department, doctor, date, reason } = form.elements;

    // Minimum date = today (local time)
    const now = new Date();
    const todayISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    date.min = todayISO;
    form.elements.dob.max = todayISO;

    // Dependent doctor dropdown
    const populateDoctors = () => {
      const list = DOCTORS[department.value] || [];
      doctor.innerHTML = list.length
        ? '<option value="">Any available doctor</option>' + list.map((d) => `<option value="${d}">${d}</option>`).join('')
        : '<option value="">Select a department first</option>';
      doctor.disabled = !list.length;
    };
    department.addEventListener('change', populateDoctors);

    // Pre-select department from URL (?department=cardiology)
    const preset = new URLSearchParams(window.location.search).get('department');
    if (preset && DOCTORS[preset]) department.value = preset;
    populateDoctors();

    // Character counter
    const charCount = $('[data-char-count]', form);
    reason.addEventListener('input', () => (charCount.textContent = reason.value.length));

    // Validation rules: return true or an error message
    const rules = {
      name: (v) => v.trim().length >= 3 || 'Please enter your full name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
      phone: (v) => v.replace(/\D/g, '').length >= 7 || 'Please enter a valid phone number.',
      department: (v) => !!v || 'Please select a department.',
      date: (v) => {
        if (!v) return 'Please choose a preferred date.';
        if (v < date.min) return 'The date cannot be in the past.';
        if (new Date(`${v}T00:00:00`).getDay() === 0) return 'Outpatient clinics are closed on Sundays.';
        return true;
      },
      time: () => !!form.querySelector('input[name="time"]:checked') || 'Please select a time slot.',
      consent: () => form.elements.consent.checked || 'Please accept the privacy policy to continue.',
    };

    const setError = (name, message) => {
      const field = form.elements[name];
      const errorEl = $(`[data-error-for="${name}"]`, form);
      const isGroup = typeof RadioNodeList !== 'undefined' && field instanceof RadioNodeList;

      if (field && !isGroup && field.type !== 'checkbox') {
        field.classList.toggle('is-invalid', !!message);
        field.setAttribute('aria-invalid', String(!!message));
      }
      if (isGroup) errorEl?.previousElementSibling?.classList.toggle('time-group-invalid', !!message);
      if (errorEl) {
        errorEl.textContent = message || '';
        errorEl.classList.toggle('is-shown', !!message);
      }
    };

    const validateField = (name) => {
      const field = form.elements[name];
      const value = field && 'value' in field ? field.value : '';
      const result = rules[name](value);
      const message = result === true ? '' : result;
      setError(name, message);
      return !message;
    };

    // Live validation
    form.addEventListener('focusout', (e) => {
      const name = e.target.name;
      if (rules[name] && (e.target.value || form.dataset.submitted)) validateField(name);
    });
    form.addEventListener('change', (e) => {
      const name = e.target.name;
      if (rules[name] && form.dataset.submitted) validateField(name);
    });
    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('is-invalid')) validateField(e.target.name);
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.dataset.submitted = 'true';

      const allValid = Object.keys(rules).map(validateField).every(Boolean);
      if (!allValid) {
        const firstError = $('.field-error.is-shown', form);
        firstError?.closest('[data-field]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Collect summary before reset
      const checkedTime = form.querySelector('input[name="time"]:checked');
      const summary = {
        name: form.elements.name.value.trim(),
        ref: 'NMC-' + Date.now().toString(36).toUpperCase().slice(-6),
        department: department.options[department.selectedIndex].text,
        doctor: doctor.value || 'Any available doctor',
        date: new Date(`${date.value}T00:00:00`).toLocaleDateString('en-US', {
          weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
        }),
        time: checkedTime.nextElementSibling.textContent.trim(),
      };

      // Simulated API request
      const submitBtn = form.querySelector('[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting…';

      setTimeout(() => {
        openModal(summary);
        form.reset();
        delete form.dataset.submitted;
        populateDoctors();
        charCount.textContent = '0';
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }, 1200);
    });
  }

  /* ---------------- Modal ---------------- */
  const modal = $('#success-modal');
  let lastFocused = null;

  function openModal(data) {
    if (!modal) return;
    Object.entries(data).forEach(([key, value]) => {
      const el = $(`[data-summary="${key}"]`, modal);
      if (el) el.textContent = value;
    });
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('button[data-modal-close]', modal)?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  if (modal) {
    $$('[data-modal-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }
})();
