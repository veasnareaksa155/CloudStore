/**
 * Cloud Store - FAQ Accordion Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.faq-item');
      const body = parent.querySelector('.faq-body');
      const isActive = header.classList.contains('active');

      // Optional: close other accordions in the same group
      document.querySelectorAll('.faq-header').forEach(h => {
        if (h !== header) {
          h.classList.remove('active');
          const otherBody = h.closest('.faq-item').querySelector('.faq-body');
          if (otherBody) otherBody.classList.remove('open');
        }
      });

      // Toggle current accordion
      if (isActive) {
        header.classList.remove('active');
        body.classList.remove('open');
      } else {
        header.classList.add('active');
        body.classList.add('open');
      }
    });
  });
});

