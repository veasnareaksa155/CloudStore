/**
 * Cloud Store - Main Global JavaScript
 * Handles responsive navigation drawer, domain lookup, cart badge sync, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initCartBadges();
  initSkillBars();
  highlightActiveNav();
  initContactForm();
  initFAQAskForm();
});

/* --- Mobile Navigation Drawer (Modern Offcanvas) --- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('drawerBackdrop');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close when clicking any nav link inside the drawer
  drawer.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close if window resized above 991px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --- Cart Badges Counter Sync (Navbar & Drawer) --- */
function initCartBadges() {
  const navBadge = document.querySelector('.nav-cart-badge');
  const drawerBadge = document.querySelector('.drawer-cart-count');

  let totalCount = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('cloud_store_cart')) || [];
    totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  } catch (err) {
    totalCount = 0;
  }

  // Navbar badge
  if (navBadge) {
    navBadge.textContent = totalCount;
    navBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  // Mobile drawer counter
  if (drawerBadge) {
    drawerBadge.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
  }
}

/* --- Highlight Active Navigation Item (Desktop & Drawer) --- */
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

  // Desktop links
  document.querySelectorAll('.navbar-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Drawer links
  document.querySelectorAll('.mobile-drawer-nav .drawer-nav-link').forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Domain Search Helper --- */
function searchDomain() {
  const input = document.getElementById('domainInput');
  if (!input) return;
  const domainName = input.value.trim().toLowerCase();

  if (!domainName) {
    alert('Please enter a domain name to search (e.g., mysite or mysite.com).');
    input.focus();
    return;
  }

  // Clean domain string
  const cleanDomain = domainName.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const extensions = ['.com', '.net', '.org', '.cloud', '.us'];
  const hasExt = extensions.some(ext => cleanDomain.endsWith(ext));
  const fullDomain = hasExt ? cleanDomain : `${cleanDomain}.com`;

  alert(`Congratulations! "${fullDomain}" is available for only $12.99/year! Click OK to proceed to registration.`);
  window.location.href = `shop.html?domain=${encodeURIComponent(fullDomain)}`;
}

/* --- Animated Skill Bars on About Page --- */
function initSkillBars() {
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  if (!progressBars.length) return;

  const animate = () => {
    progressBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent') || '0';
      bar.style.width = `${percent}%`;
    });
  };

  // Run on load and after short timeout for transition effect
  setTimeout(animate, 200);
}

/* --- Contact Page Form Submit --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value || 'Customer';
    alert(`Thank you, ${name}! Your message has been received. Our team will contact you within 24 hours.`);
    form.reset();
  });
}

/* --- FAQ Ask Form Submit --- */
function initFAQAskForm() {
  const form = document.getElementById('faqAskForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for asking! Your question has been forwarded to our support team.');
    form.reset();
  });
}

// Global exposure for inline onclicks
window.searchDomain = searchDomain;
window.updateCartBadge = initCartBadges;
