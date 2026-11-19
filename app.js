(() => {
  'use strict';

  const nav = document.getElementById('primaryNav');
  const navToggle = document.getElementById('navToggle');
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  const productChoice = document.getElementById('productChoice');
  document.querySelectorAll('[data-product]').forEach(link => link.addEventListener('click', () => {
    productChoice.value = link.dataset.product;
  }));

  const filters = [...document.querySelectorAll('[data-filter]')];
  const photos = [...document.querySelectorAll('.photo')];
  let visiblePhotos = photos;
  let activeIndex = 0;

  function applyFilter(value) {
    filters.forEach(button => {
      const active = button.dataset.filter === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    photos.forEach(photo => {
      photo.hidden = value !== 'all' && photo.dataset.category !== value;
    });
    visiblePhotos = photos.filter(photo => !photo.hidden);
  }
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
  document.querySelectorAll('[data-filter-link]').forEach(link => link.addEventListener('click', () => {
    applyFilter(link.dataset.filterLink);
  }));

  const viewer = document.getElementById('viewer');
  const viewerImage = document.getElementById('viewerImage');
  const viewerCaption = document.getElementById('viewerCaption');
  const viewerClose = document.getElementById('viewerClose');

  function moveToPhoto(index) {
    if (visiblePhotos.length === 0) return;
    activeIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const source = visiblePhotos[activeIndex];
    viewerImage.src = source.dataset.image;
    viewerImage.alt = source.querySelector('img').alt;
    viewerCaption.textContent = `${source.dataset.caption} · ${activeIndex + 1} of ${visiblePhotos.length}`;
  }
  photos.forEach(photo => photo.addEventListener('click', () => {
    moveToPhoto(visiblePhotos.indexOf(photo));
    viewer.showModal();
    viewerClose.focus();
  }));
  viewerClose.addEventListener('click', () => viewer.close());
  document.getElementById('viewerPrev').addEventListener('click', () => moveToPhoto(activeIndex - 1));
  document.getElementById('viewerNext').addEventListener('click', () => moveToPhoto(activeIndex + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveToPhoto(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveToPhoto(activeIndex + 1); }
  });
  let touchStartX = null;
  viewerImage.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0]?.screenX ?? null;
  }, { passive: true });
  viewerImage.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const x = event.changedTouches[0]?.screenX ?? touchStartX;
    if (Math.abs(x - touchStartX) > 45) moveToPhoto(activeIndex + (x < touchStartX ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  const form = document.getElementById('enquiry');
  const status = document.getElementById('formStatus');
  function preparedMessage() {
    if (!form.reportValidity()) return null;
    const input = new FormData(form);
    return [
      'Hello NAYAN NANDY, I have a product enquiry.', '',
      `Name: ${input.get('name')}`,
      `Phone: ${input.get('phone')}`,
      `Email: ${input.get('email')}`,
      `Company: ${input.get('company') || 'Not specified'}`,
      `Product: ${input.get('product')}`,
      `Requirement: ${input.get('message')}`
    ].join('\n');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = preparedMessage();
    if (!message) return;
    const link = document.createElement('a');
    link.href = `https://wa.me/919475236106?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
    status.textContent = 'WhatsApp is opening. Please review the prepared message and tap Send in WhatsApp.';
  });
  document.getElementById('emailButton').addEventListener('click', () => {
    const message = preparedMessage();
    if (!message) return;
    window.location.href = `mailto:sales@nayannandy.com?subject=${encodeURIComponent('NAYAN NANDY — product enquiry')}&body=${encodeURIComponent(message)}`;
    status.textContent = 'Your email application is opening. Please review and send the prepared email.';
  });
})();
