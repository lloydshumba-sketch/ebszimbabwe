document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuBtn');
  const closeButton = document.getElementById('closeBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('mobileBackdrop');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdown = document.querySelector('.nav-dropdown');
  const dialog = document.getElementById('demoDialog');
  const dialogTitle = document.getElementById('demoTitle');
  let previousFocus = null;

  const setMenu = (isOpen) => {
    if (!menuButton || !mobileMenu || !backdrop) return;
    mobileMenu.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    backdrop.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    if (isOpen) {
      previousFocus = document.activeElement;
      mobileMenu.focus();
    } else if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  menuButton?.addEventListener('click', () => setMenu(true));
  closeButton?.addEventListener('click', () => setMenu(false));
  backdrop?.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.mobile-links a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  dropdownToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
    dropdownToggle.setAttribute('aria-expanded', String(!expanded));
  });
  document.addEventListener('click', (event) => {
    if (dropdown && !dropdown.contains(event.target)) dropdownToggle?.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      dropdownToggle?.setAttribute('aria-expanded', 'false');
      if (dialog?.open) dialog.close();
    }
    if (event.key === 'Tab' && mobileMenu?.classList.contains('open')) {
      const focusable = [...mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });

  document.querySelectorAll('.demo-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!dialog) return;
      dialogTitle.textContent = trigger.dataset.lecture || 'Lecture preview';
      dialog.showModal();
    });
  });
  dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observerInstance.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
