/**
 * Cloud Store - Shop, Cart & Checkout Engine
 */

// Product catalog database
const products = [
  { id: 1, name: "Starter Cloud VPS", price: 34, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package2-1-600x600.jpg", popularity: 5, sku: "SKU-VPS1" },
  { id: 2, name: "Business Web Host", price: 40, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package1-1-600x600.jpg", popularity: 8, sku: "SKU-WEB2" },
  { id: 3, name: "Enterprise Dedicated", price: 55, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package7-1-600x600.jpg", popularity: 3, sku: "SKU-DED3" },
  { id: 4, name: "WordPress Pro Host", price: 30, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package6-1-600x600.jpg", popularity: 7, sku: "SKU-WP4" },
  { id: 5, name: "Node.js Cloud Engine", price: 35, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package5-1-600x600.jpg", popularity: 4, sku: "SKU-NODE5" },
  { id: 6, name: "High-Traffic Cluster", price: 40, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package4-1-600x600.jpg", popularity: 6, sku: "SKU-CLUS6" },
  { id: 7, name: "Global CDN Accelerator", price: 60, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package7-1-600x600.jpg", popularity: 2, sku: "SKU-CDN7" },
  { id: 8, name: "Ultra NVMe Dedicated", price: 85, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package6-1-600x600.jpg", popularity: 1, sku: "SKU-NVME8" },
  { id: 9, name: "Micro Cloud Server", price: 20, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package5-1-600x600.jpg", popularity: 9, sku: "SKU-MIC9" },
  { id: 10, name: "PostgreSQL Database VPS", price: 35, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package4-1-600x600.jpg", popularity: 10, sku: "SKU-DB10" },
  { id: 11, name: "SSL Certificate Wildcard", price: 20, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package3-1-600x600.jpg", popularity: 12, sku: "SKU-SSL11" },
  { id: 12, name: "Managed Kubernetes", price: 56, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package2-1-600x600.jpg", popularity: 11, sku: "SKU-K8S12" },
  { id: 13, name: "Enterprise Reseller Hub", price: 60, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package1-1-600x600.jpg", popularity: 13, sku: "SKU-RES13" },
  { id: 14, name: "Python FastAPI Cloud", price: 35, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package7-1-600x600.jpg", popularity: 14, sku: "SKU-PY14" },
  { id: 15, name: "DDoS Protected Server", price: 60, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package6-1-600x600.jpg", popularity: 15, sku: "SKU-SEC15" },
  { id: 16, name: "Storage Block (10TB)", price: 58, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package5-1-600x600.jpg", popularity: 16, sku: "SKU-STR16" },
  { id: 17, name: "Automated Daily Backups", price: 35, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package4-1-600x600.jpg", popularity: 17, sku: "SKU-BAK17" },
  { id: 18, name: "Corporate Email Suite", price: 35, image: "https://xtratheme.com/elementor/hosting/wp-content/uploads/sites/32/2017/06/package3-1-600x600.jpg", popularity: 18, sku: "SKU-MAIL18" }
];

// Cart state loaded from localStorage
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('cloud_store_cart')) || [];
} catch (e) {
  cart = [];
}

let discountPercent = 0;

// DOM Elements
const productGrid = document.getElementById("product-grid");
const productCountSelect = document.getElementById("product-count");
const sortBySelect = document.getElementById("sort-by");
const resultsCount = document.getElementById("results-count");
const filterSection = document.getElementById("filter-section");
const cartPage = document.getElementById("cart-page");
const cartItemsTable = document.getElementById("cart-items");
const checkoutPage = document.getElementById("checkout-page");
const continueShoppingBtn = document.getElementById("continue-shopping");
const returnBackBtn = document.getElementById("return-back-btn");

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'cart') {
    showCartPage();
  } else {
    initProductCatalog();
  }
  initQuickViewModal();
  syncCartBadge();
});

// Save cart helper
function saveCart() {
  localStorage.setItem('cloud_store_cart', JSON.stringify(cart));
  syncCartBadge();
}

function syncCartBadge() {
  if (typeof window.updateCartBadge === 'function') {
    window.updateCartBadge();
  }
}

// Initialize catalog
function initProductCatalog() {
  if (!productGrid) return;
  updateCatalogView();

  if (productCountSelect) {
    productCountSelect.addEventListener("change", updateCatalogView);
  }
  if (sortBySelect) {
    sortBySelect.addEventListener("change", updateCatalogView);
  }
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", showProductGrid);
  }
  if (returnBackBtn) {
    returnBackBtn.addEventListener("click", handleReturnBack);
  }
}

// Filter and sort catalog
function getFilteredProducts() {
  const count = productCountSelect ? parseInt(productCountSelect.value, 10) : 6;
  const sortBy = sortBySelect ? sortBySelect.value : 'popular';

  let list = [...products];

  if (sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => a.popularity - b.popularity);
  }

  return list.slice(0, count);
}

function updateCatalogView() {
  const toShow = getFilteredProducts();
  renderProducts(toShow);
}

// Render product cards
function renderProducts(items) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  items.forEach(product => {
    let badgeHtml = '';
    if (product.popularity <= 3) {
      badgeHtml = '<span class="shop-card-badge badge-bestseller"><i class="bi bi-fire"></i> Best Seller</span>';
    } else if (product.price >= 60) {
      badgeHtml = '<span class="shop-card-badge badge-pro"><i class="bi bi-cpu"></i> Enterprise</span>';
    } else if (product.price <= 25) {
      badgeHtml = '<span class="shop-card-badge badge-value"><i class="bi bi-tag-fill"></i> Best Value</span>';
    } else {
      badgeHtml = '<span class="shop-card-badge"><i class="bi bi-lightning-charge-fill"></i> Fast Setup</span>';
    }

    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      ${badgeHtml}
      <div class="shop-card-img-wrap" onclick="openQuickView(${product.id})" style="cursor: pointer;" title="Quick View">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="shop-quick-view-btn" type="button" onclick="event.stopPropagation(); openQuickView(${product.id});" aria-label="Quick view ${product.name}">
          <i class="bi bi-eye"></i> Quick View
        </button>
      </div>
      <h3 class="shop-card-title" onclick="openQuickView(${product.id})" title="Quick View">${product.name}</h3>
      <p class="shop-card-sku">${product.sku}</p>
      <div class="shop-card-footer">
        <div class="shop-card-price">$${product.price}</div>
        <button class="shop-card-add-btn" data-id="${product.id}">
          <i class="bi bi-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  if (resultsCount) {
    resultsCount.textContent = `Showing ${items.length} of ${products.length} products`;
  }

  // Bind add-to-cart buttons
  productGrid.querySelectorAll(".shop-card-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pid = parseInt(btn.getAttribute("data-id"), 10);
      addToCart(pid);
    });
  });
}

// Add item to cart
function addToCart(productId, quantity = 1, shouldShowCart = true) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const qty = parseInt(quantity, 10) || 1;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  saveCart();
  renderCart();
  if (shouldShowCart) {
    showCartPage();
  }
}

// Render Cart view
function renderCart() {
  if (!cartItemsTable) return;
  cartItemsTable.innerHTML = "";

  if (cart.length === 0) {
    cartItemsTable.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 40px; color: var(--gray-text);">
          <i class="bi bi-cart-x" style="font-size: 3rem; display: block; margin-bottom: 12px; color: #cbd5e1;"></i>
          <p style="font-size: 1.1rem; margin-bottom: 16px;">Your cart is currently empty.</p>
          <button class="btn-custom btn-primary-custom" onclick="showProductGrid()">
            <i class="bi bi-arrow-left"></i> Browse Products
          </button>
        </td>
      </tr>
    `;
    return;
  }

  cart.forEach(item => {
    const subtotal = (item.price * item.quantity).toFixed(2);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <button class="cart-remove-btn" data-id="${item.id}" title="Remove item">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
      <td>
        <div class="cart-item-product">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span>${item.sku}</span>
          </div>
        </div>
      </td>
      <td><strong>$${item.price.toFixed(2)}</strong></td>
      <td>
        <div class="cart-qty-control">
          <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
        </div>
      </td>
      <td><strong class="text-primary-custom">$${subtotal}</strong></td>
    `;
    cartItemsTable.appendChild(tr);
  });

  // Attach event handlers
  cartItemsTable.querySelectorAll(".cart-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = parseInt(btn.getAttribute("data-id"), 10);
      cart = cart.filter(i => i.id !== pid);
      saveCart();
      renderCart();
    });
  });

  cartItemsTable.querySelectorAll(".inc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = parseInt(btn.getAttribute("data-id"), 10);
      const item = cart.find(i => i.id === pid);
      if (item) {
        item.quantity += 1;
        saveCart();
        renderCart();
      }
    });
  });

  cartItemsTable.querySelectorAll(".dec-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = parseInt(btn.getAttribute("data-id"), 10);
      const item = cart.find(i => i.id === pid);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart();
        renderCart();
      }
    });
  });
}

// Navigation between views
function showCartPage() {
  if (productGrid) productGrid.style.display = "none";
  if (filterSection) filterSection.style.display = "none";
  if (checkoutPage) checkoutPage.classList.remove("active");
  if (cartPage) cartPage.classList.add("active");
  renderCart();
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function showProductGrid() {
  if (cartPage) cartPage.classList.remove("active");
  if (checkoutPage) checkoutPage.classList.remove("active");
  if (productGrid) productGrid.style.display = "grid";
  if (filterSection) filterSection.style.display = "flex";
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function handleReturnBack() {
  if (checkoutPage && checkoutPage.classList.contains("active")) {
    showCartPage();
  } else if (cartPage && cartPage.classList.contains("active")) {
    showProductGrid();
  } else {
    window.location.href = "index.html";
  }
}

// Apply coupon code
function applyCoupon() {
  const couponInput = document.getElementById("coupon-code");
  if (!couponInput) return;
  const code = couponInput.value.trim().toUpperCase();

  if (code === "CLOUD20" || code === "SAVE20") {
    discountPercent = 0.20;
    alert("Coupon applied! 20% discount will be calculated at checkout.");
  } else if (code === "HOST10" || code === "SAVE10") {
    discountPercent = 0.10;
    alert("Coupon applied! 10% discount will be calculated at checkout.");
  } else {
    alert("Invalid coupon code. Try 'CLOUD20' for 20% off.");
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add items before checking out.");
    return;
  }

  if (cartPage) cartPage.classList.remove("active");
  if (productGrid) productGrid.style.display = "none";
  if (filterSection) filterSection.style.display = "none";
  if (checkoutPage) checkoutPage.classList.add("active");

  updateCheckoutSummary();
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// Update checkout order summary
function updateCheckoutSummary() {
  const productList = document.getElementById("checkout-product-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const discountEl = document.getElementById("checkout-discount");
  const totalEl = document.getElementById("checkout-total");

  if (!productList) return;
  productList.innerHTML = "";

  let rawSubtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    rawSubtotal += itemTotal;
    const row = document.createElement("div");
    row.className = "order-summary-row";
    row.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <strong>$${itemTotal.toFixed(2)}</strong>
    `;
    productList.appendChild(row);
  });

  const discountAmount = rawSubtotal * discountPercent;
  const finalTotal = rawSubtotal - discountAmount;

  if (subtotalEl) subtotalEl.textContent = `$${rawSubtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = discountPercent > 0 ? `-$${discountAmount.toFixed(2)} (${discountPercent * 100}%)` : '$0.00';
  if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;
}

// Place Order
function placeOrder() {
  const form = document.getElementById("billing-form");
  if (!form || !form.checkValidity()) {
    alert("Please fill out all required billing fields before placing your order.");
    if (form) form.reportValidity();
    return;
  }

  const firstName = document.getElementById("first-name")?.value || "";
  const lastName = document.getElementById("last-name")?.value || "";
  const street = document.getElementById("street-address")?.value || "";
  const city = document.getElementById("town-city")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const email = document.getElementById("email")?.value || "";

  // Show confirmation modal
  const modal = document.getElementById("address-save-modal");
  if (modal) {
    document.getElementById("modal-address").textContent = `${firstName} ${lastName}, ${street}, ${city}`;
    document.getElementById("modal-phone").textContent = phone;
    document.getElementById("modal-email").textContent = email;
    modal.classList.add("active");
  } else {
    completeOrderSuccess();
  }
}

function completeOrderSuccess() {
  const modal = document.getElementById("address-save-modal");
  if (modal) modal.classList.remove("active");

  alert("🎉 Thank you! Your cloud hosting order has been placed successfully. A receipt has been sent to your email.");
  cart = [];
  saveCart();
  showProductGrid();
}

function closeOrderModal() {
  const modal = document.getElementById("address-save-modal");
  if (modal) modal.classList.remove("active");
}

// -------------------------------------------------------------
// Quick View Modal System
// -------------------------------------------------------------
let currentQvProductId = null;
let currentQvQuantity = 1;

function getProductSpecs(product) {
  if (product.name.includes("Dedicated") || product.name.includes("NVMe") || product.name.includes("Cluster")) {
    return [
      { icon: "bi-cpu-fill", text: "8 Dedicated Cores (Up to 4.5GHz)" },
      { icon: "bi-memory", text: "32GB DDR5 ECC RAM" },
      { icon: "bi-hdd-network-fill", text: "500GB Gen4 NVMe SSD" },
      { icon: "bi-speedometer2", text: "10 Gbps Unmetered Uplink" },
      { icon: "bi-shield-shaded", text: "Advanced DDoS Mitigation" },
      { icon: "bi-arrow-repeat", text: "Daily Automated Snapshots" }
    ];
  } else if (product.name.includes("SSL")) {
    return [
      { icon: "bi-shield-check", text: "Wildcard & Multi-Domain Support" },
      { icon: "bi-lock-fill", text: "256-Bit Industry Encryption" },
      { icon: "bi-patch-check-fill", text: "$1.5M Warranty Protection" },
      { icon: "bi-lightning-fill", text: "Instant Automated Issuance" },
      { icon: "bi-browser-chrome", text: "99.9% Browser Compatibility" },
      { icon: "bi-award-fill", text: "Trust Seal Badge Included" }
    ];
  } else if (product.name.includes("Storage") || product.name.includes("Backup")) {
    return [
      { icon: "bi-database-fill-check", text: "Enterprise Block Storage" },
      { icon: "bi-cloud-arrow-up-fill", text: "Continuous Real-Time Sync" },
      { icon: "bi-shield-lock-fill", text: "End-to-End Encryption (AES-256)" },
      { icon: "bi-clock-history", text: "30-Day Version History" },
      { icon: "bi-hdd-stack-fill", text: "Triple Redundancy RAID" },
      { icon: "bi-globe", text: "Global Multi-Zone Replicas" }
    ];
  } else if (product.name.includes("Email")) {
    return [
      { icon: "bi-envelope-at-fill", text: "Unlimited Custom Domain Inboxes" },
      { icon: "bi-shield-fill-exclamation", text: "Spam & Phishing AI Shield" },
      { icon: "bi-phone-fill", text: "ActiveSync for Mobile & Webmail" },
      { icon: "bi-hdd-fill", text: "50GB Storage per Mailbox" },
      { icon: "bi-calendar-check-fill", text: "Integrated Calendar & Contacts" },
      { icon: "bi-patch-check", text: "DKIM, SPF & DMARC Setup" }
    ];
  } else {
    return [
      { icon: "bi-cpu-fill", text: "4 vCPU High-Performance Cores" },
      { icon: "bi-memory", text: "8GB High-Speed RAM" },
      { icon: "bi-hdd-fill", text: "100GB Ultra NVMe Storage" },
      { icon: "bi-speedometer2", text: "1 Gbps High-Speed Port" },
      { icon: "bi-shield-check", text: "Free SSL & Dedicated IPv4" },
      { icon: "bi-terminal-fill", text: "Full Root & SSH Terminal Access" }
    ];
  }
}

function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentQvProductId = productId;
  currentQvQuantity = 1;

  const modal = document.getElementById("quick-view-modal");
  const imgEl = document.getElementById("qv-image");
  const titleEl = document.getElementById("qv-title");
  const skuEl = document.getElementById("qv-sku");
  const priceEl = document.getElementById("qv-price");
  const descEl = document.getElementById("qv-description");
  const badgeEl = document.getElementById("qv-badge");
  const categoryEl = document.getElementById("qv-category");
  const reviewsEl = document.getElementById("qv-reviews");
  const specsListEl = document.getElementById("qv-specs-list");
  const qtyInput = document.getElementById("qv-qty-input");

  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
  }
  if (titleEl) titleEl.textContent = product.name;
  if (skuEl) skuEl.textContent = product.sku;
  if (priceEl) priceEl.textContent = product.price.toFixed(2);
  if (qtyInput) qtyInput.value = 1;

  if (categoryEl) {
    if (product.price >= 60) {
      categoryEl.innerHTML = '<i class="bi bi-cpu"></i> Enterprise Infrastructure';
    } else if (product.name.includes("SSL")) {
      categoryEl.innerHTML = '<i class="bi bi-shield-lock"></i> Security & Certificates';
    } else if (product.name.includes("Storage") || product.name.includes("Backup")) {
      categoryEl.innerHTML = '<i class="bi bi-hdd-network"></i> Cloud Storage & Backup';
    } else if (product.name.includes("Email")) {
      categoryEl.innerHTML = '<i class="bi bi-envelope"></i> Enterprise Communications';
    } else {
      categoryEl.innerHTML = '<i class="bi bi-cloud-check"></i> Cloud VPS Solutions';
    }
  }

  if (reviewsEl) {
    reviewsEl.textContent = `4.9 (${35 + (product.id * 7)} Verified Reviews)`;
  }

  if (badgeEl) {
    if (product.popularity <= 3) {
      badgeEl.innerHTML = '<i class="bi bi-fire"></i> Best Seller';
      badgeEl.style.color = '#dc2626';
      badgeEl.style.background = '#fef2f2';
      badgeEl.style.borderColor = 'rgba(220, 38, 38, 0.2)';
    } else if (product.price >= 60) {
      badgeEl.innerHTML = '<i class="bi bi-cpu"></i> Enterprise Grade';
      badgeEl.style.color = '#2563eb';
      badgeEl.style.background = '#eff6ff';
      badgeEl.style.borderColor = 'rgba(37, 99, 235, 0.2)';
    } else if (product.price <= 25) {
      badgeEl.innerHTML = '<i class="bi bi-tag-fill"></i> Best Value';
      badgeEl.style.color = '#059669';
      badgeEl.style.background = '#ecfdf5';
      badgeEl.style.borderColor = 'rgba(5, 150, 105, 0.2)';
    } else {
      badgeEl.innerHTML = '<i class="bi bi-lightning-charge-fill"></i> Fast Provisioning';
      badgeEl.style.color = 'var(--primary)';
      badgeEl.style.background = 'rgba(0, 69, 160, 0.08)';
      badgeEl.style.borderColor = 'rgba(0, 69, 160, 0.15)';
    }
  }

  if (descEl) {
    descEl.textContent = `Deploy ${product.name} instantly with full administrative control, ultra-low latency NVMe storage, and 24/7/365 enterprise DevOps monitoring.`;
  }

  if (specsListEl) {
    const specs = getProductSpecs(product);
    specsListEl.innerHTML = specs.map(s => `
      <li><i class="bi ${s.icon}"></i> <span>${s.text}</span></li>
    `).join("");
  }

  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeQuickViewModal() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function initQuickViewModal() {
  const modal = document.getElementById("quick-view-modal");
  const minusBtn = document.getElementById("qv-qty-minus");
  const plusBtn = document.getElementById("qv-qty-plus");
  const qtyInput = document.getElementById("qv-qty-input");
  const addCartBtn = document.getElementById("qv-btn-add-cart");
  const buyNowBtn = document.getElementById("qv-btn-buy-now");

  if (minusBtn) {
    minusBtn.addEventListener("click", () => {
      if (currentQvQuantity > 1) {
        currentQvQuantity--;
        if (qtyInput) qtyInput.value = currentQvQuantity;
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener("click", () => {
      if (currentQvQuantity < 99) {
        currentQvQuantity++;
        if (qtyInput) qtyInput.value = currentQvQuantity;
      }
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      if (currentQvProductId) {
        addToCart(currentQvProductId, currentQvQuantity, true);
        closeQuickViewModal();
      }
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (currentQvProductId) {
        addToCart(currentQvProductId, currentQvQuantity, false);
        closeQuickViewModal();
        proceedToCheckout();
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeQuickViewModal();
      }
    });
  }

  // Global ESC key listener to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickViewModal();
      closeOrderModal();
    }
  });
}

// Global exposures
window.addToCart = addToCart;
window.showCartPage = showCartPage;
window.showProductGrid = showProductGrid;
window.proceedToCheckout = proceedToCheckout;
window.placeOrder = placeOrder;
window.applyCoupon = applyCoupon;
window.closeOrderModal = closeOrderModal;
window.completeOrderSuccess = completeOrderSuccess;
window.openQuickView = openQuickView;
window.closeQuickViewModal = closeQuickViewModal;


