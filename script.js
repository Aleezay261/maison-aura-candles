const PRODUCTS = [
  {
    id: 'candle-amber',
    name: 'No. 01 — Ambre Nuit',
    frenchTitle: 'Ambre Nuit • Soirée Mystique',
    scents: 'Smoked Sandalwood, Raw Amber, Cashmere Vanilla',
    category: 'woody',
    categoryName: 'Woody & Warm',
    price: 4800,
    burnTime: '60 Hours',
    weight: '280g / 9.8 oz',
    badge: 'Best Seller',
    image: 'image/candle-amber.png',
    topNotes: 'Italian Bergamot, Cistus Labdanum',
    heartNotes: 'Smoked Sandalwood, Cedar Embers',
    baseNotes: 'Golden Amber Resin, Bourbon Vanilla',
    description: 'An intimate, intoxicating aroma evocative of midnight salons and Parisian leather bindings. Hand-poured with botanical soy-coconut wax and clean cotton wicks.'
  },
  {
    id: 'candle-santal',
    name: 'No. 02 — Santal Impérial',
    frenchTitle: 'Santal Impérial • Bois Sacré',
    scents: 'Australian Sandalwood, Cardamom, Papyrus, Warm Leather',
    category: 'woody',
    categoryName: 'Woody & Warm',
    price: 5200,
    burnTime: '65 Hours',
    weight: '300g / 10.5 oz',
    badge: 'Signature',
    image: 'image/candle-santal.png',
    topNotes: 'Green Cardamom, Violet Leaves',
    heartNotes: 'Australian Sandalwood, Papyrus Reed',
    baseNotes: 'Ambergris, White Leather, Cedar',
    description: 'Noble Australian sandalwood paired with smoky Egyptian papyrus and ancient balsamic resin. A meditative, architectural scent that anchors any room in calm.'
  },
  {
    id: 'candle-fig',
    name: 'No. 03 — Figue Sauvage',
    frenchTitle: 'Figue Sauvage • Rives d’Azur',
    scents: 'Mediterranean Fig Leaf, Ripe Black Fig, Green Stem, Cedar',
    category: 'botanical',
    categoryName: 'Fresh Botanical',
    price: 4600,
    burnTime: '55 Hours',
    weight: '260g / 9.1 oz',
    badge: "Editor's Pick",
    image: 'image/candle-fig.png',
    topNotes: 'Crushed Fig Leaves, Bitter Orange',
    heartNotes: 'Ripe Black Fig, Coconut Milk',
    baseNotes: 'White Cedarwood, Sunlit Earth',
    description: 'Transport yourself to sun-warmed Mediterranean groves where wild fig leaves rustle under coastal breezes. Green, milky, and effortlessly vibrant.'
  },
  {
    id: 'candle-sage',
    name: 'No. 04 — Brume de Sauge',
    frenchTitle: 'Brume de Sauge • Rentrée Botanique',
    scents: 'Wild Clary Sage, Sea Salt Mist, Driftwood, Crisp Cypress',
    category: 'botanical',
    categoryName: 'Fresh Botanical',
    price: 4500,
    burnTime: '55 Hours',
    weight: '260g / 9.1 oz',
    badge: 'Botanical',
    image: 'image/candle-sage.png',
    topNotes: 'Mineral Sea Salt, Clary Sage',
    heartNotes: 'Blue Eucalyptus, Italian Cypress',
    baseNotes: 'Sun-Bleached Driftwood, Velvet Moss',
    description: 'The purifying clarity of sea salt mingling with herbaceous alpine sage and crushed cypress cones. Designed for focused contemplation and calm.'
  },
  {
    id: 'candle-cedar',
    name: 'No. 05 — Cèdre Blanc',
    frenchTitle: 'Cèdre Blanc • Forêt Silencieuse',
    scents: 'Atlas Mountain Cedar, White Pine, Juniper Berry, Frankincense',
    category: 'woody',
    categoryName: 'Woody & Warm',
    price: 4800,
    burnTime: '60 Hours',
    weight: '280g / 9.8 oz',
    badge: 'Winter Atelier',
    image: 'image/candle-cedar.png',
    topNotes: 'Wild Juniper Berry, Frosted Mint',
    heartNotes: 'Atlas Cedarwood, White Pine Needle',
    baseNotes: 'Sacred Frankincense, Dry Moss',
    description: 'A quiet dawn in high alpine groves. Crisp winter air carrying the balsamic sap of evergreen needles, grounded by ancient white cedar roots.'
  }
];

// Helper: Format Price in Rs.
function formatPKR(num) {
  return 'Rs. ' + Number(num).toLocaleString('en-PK');
}

// ==========================================================================
// 2. LOCALSTORAGE CART SYSTEM
// ==========================================================================
const CART_STORAGE_KEY = 'maison_aura_cart_pkr';
const PROMO_STORAGE_KEY = 'maison_aura_promo_pkr';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse cart:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
  updateCartBadge();
  updateCartDrawer();
  if (typeof renderOrderReview === 'function') {
    renderOrderReview();
  }
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const parsedQty = parseInt(quantity, 10) || 1;
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += parsedQty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      scents: product.scents,
      price: product.price,
      image: product.image,
      weight: product.weight,
      quantity: parsedQty
    });
  }

  saveCart(cart);
  showToast(`Added ${parsedQty} × "${product.name}" to basket`);
}

function updateCartItemQuantity(productId, newQty) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const qty = parseInt(newQty, 10);
    if (qty <= 0) {
      cart.splice(itemIndex, 1);
      showToast('Item removed from basket');
    } else {
      cart[itemIndex].quantity = qty;
    }
    saveCart(cart);
  }
}

function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  showToast('Item removed from basket');
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(PROMO_STORAGE_KEY);
  saveCart([]);
}

function getCartCalculations() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active promo
  let discount = 0;
  let promoCode = localStorage.getItem(PROMO_STORAGE_KEY);
  if (promoCode === 'AURA10') {
    discount = Math.round(subtotal * 0.10); // 10% off
  }

  // Shipping logic: Free over Rs. 8,000, otherwise Rs. 350
  let shippingMethod = 'standard';
  const shippingRadio = document.querySelector('input[name="shipping_method"]:checked');
  if (shippingRadio) {
    shippingMethod = shippingRadio.value;
  }

  let shippingCost = 0;
  if (cart.length > 0) {
    if (shippingMethod === 'express') {
      shippingCost = promoCode === 'MAISONFREE' ? 0 : 800;
    } else {
      shippingCost = (subtotal >= 8000 || promoCode === 'MAISONFREE') ? 0 : 350;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingCost);

  return {
    cart,
    subtotal,
    itemCount,
    discount,
    promoCode,
    shippingCost,
    shippingMethod,
    grandTotal
  };
}

// ==========================================================================
// 3. CART BADGE & SLIDE-OUT DRAWER
// ==========================================================================
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  });
}

function initCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  const toggles = document.querySelectorAll('.cart-toggle-btn');
  const closeBtn = document.getElementById('cartDrawerClose');

  if (!overlay || !drawer) return;

  function openDrawer(e) {
    if (e) e.preventDefault();
    overlay.classList.add('open');
    drawer.classList.add('open');
    updateCartDrawer();
  }

  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  }

  toggles.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

function updateCartDrawer() {
  const drawerBody = document.getElementById('cartDrawerBody');
  const drawerFooter = document.getElementById('cartDrawerFooter');
  if (!drawerBody || !drawerFooter) return;

  const { cart, subtotal } = getCartCalculations();

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-cart-state" style="padding: 2.5rem 1rem;">
        <div class="empty-cart-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h4 class="empty-cart-title" style="font-size: 1.25rem;">Your Sanctuary is Empty</h4>
        <p class="empty-cart-desc" style="font-size: 0.82rem;">Discover our botanical wax creations and invite tranquility into your home.</p>
        <a href="products.html" class="btn btn-secondary btn-sm">Explore Collection</a>
      </div>
    `;
    drawerFooter.style.display = 'none';
    return;
  }

  drawerFooter.style.display = 'block';

  // Free delivery progress bar (Rs. 8,000 threshold)
  const threshold = 8000;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remaining = threshold - subtotal;
  const freeShippingMessage = subtotal >= threshold
    ? 'You qualify for <strong>Complimentary Delivery</strong>'
    : `Add <strong>${formatPKR(remaining)}</strong> more for complimentary delivery`;

  drawerBody.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <div class="free-shipping-progress">
        <div class="free-shipping-bar" style="width: ${progressPercent}%;"></div>
      </div>
      <p class="free-shipping-text">${freeShippingMessage}</p>
    </div>
    <div class="cart-items-review">
      ${cart.map(item => `
        <div class="cart-review-item">
          <img src="${item.image}" alt="${item.name}" class="cart-review-thumb">
          <div class="cart-review-details">
            <h4>${item.name}</h4>
            <p class="cart-review-scent">${item.scents}</p>
            <div class="quantity-control">
              <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">−</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div>
            <div class="cart-review-subtotal">${formatPKR(item.price * item.quantity)}</div>
            <button class="cart-remove-btn" onclick="removeCartItem('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  drawerFooter.innerHTML = `
    <div class="price-line" style="font-size: 1rem; margin-bottom: 1.25rem;">
      <span>Subtotal</span>
      <span style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 600;">${formatPKR(subtotal)}</span>
    </div>
    <a href="order.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
    <a href="products.html" class="btn btn-secondary btn-block" style="margin-top: 0.6rem;">Continue Shopping</a>
  `;
}

// ==========================================================================
// 4. MOBILE NAVIGATION
// ==========================================================================
function initMobileNav() {
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileNavOverlay');
  const panel = document.getElementById('mobileNavPanel');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!toggle || !panel) return;

  function openNav() {
    overlay.classList.add('open');
    panel.classList.add('open');
  }

  function closeNav() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
  }

  toggle.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });
}

// ==========================================================================
// 5. TOAST NOTIFICATIONS (No Emojis — Sleek Minimalist SVG Checkmark)
// ==========================================================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#A84538' : 'var(--color-sage)'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================================================
// 6. QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalOverlay = document.getElementById('quickViewModal');
  const modalContent = document.getElementById('quickViewContainer');
  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <div class="quick-view-grid">
      <div>
        <img src="${product.image}" alt="${product.name}" class="quick-view-img">
      </div>
      <div>
        <span class="eyebrow"><span class="eyebrow-pip"></span> ${product.categoryName}</span>
        <h2 style="font-size: 2rem; margin-bottom: 0.4rem;">${product.name}</h2>
        <p class="serif-italic" style="color: var(--color-mocha); margin-bottom: 1rem;">${product.frenchTitle}</p>
        <p style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 600; margin-bottom: 1rem;">${formatPKR(product.price)}</p>
        <p style="font-size: 0.9rem; color: var(--color-charcoal-light); margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
        
        <div style="background-color: var(--color-ivory); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.82rem;">
          <div style="margin-bottom: 0.4rem;"><strong>Top Notes:</strong> ${product.topNotes}</div>
          <div style="margin-bottom: 0.4rem;"><strong>Heart Notes:</strong> ${product.heartNotes}</div>
          <div style="margin-bottom: 0.4rem;"><strong>Base Notes:</strong> ${product.baseNotes}</div>
          <div style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px dashed var(--color-border); color: var(--color-charcoal-muted);">
            Burn Time: ${product.burnTime} &bull; Weight: ${product.weight} &bull; 100% Cotton Wick
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <div class="quantity-control" style="height: 44px;">
            <button class="qty-btn" id="modalQtyMinus" style="height: 44px; width: 34px;">−</button>
            <input type="text" class="qty-input" id="modalQtyInput" value="1" readonly style="height: 44px; width: 34px;">
            <button class="qty-btn" id="modalQtyPlus" style="height: 44px; width: 34px;">+</button>
          </div>
          <button class="btn btn-primary" id="modalAddToCartBtn" style="flex-grow: 1; height: 44px;">
            Add to Basket &bull; ${formatPKR(product.price)}
          </button>
        </div>
      </div>
    </div>
  `;

  let currentQty = 1;
  const qtyInput = document.getElementById('modalQtyInput');
  const addBtn = document.getElementById('modalAddToCartBtn');

  document.getElementById('modalQtyMinus').onclick = () => {
    if (currentQty > 1) {
      currentQty--;
      qtyInput.value = currentQty;
      addBtn.textContent = `Add to Basket • ${formatPKR(product.price * currentQty)}`;
    }
  };

  document.getElementById('modalQtyPlus').onclick = () => {
    currentQty++;
    qtyInput.value = currentQty;
    addBtn.textContent = `Add to Basket • ${formatPKR(product.price * currentQty)}`;
  };

  addBtn.onclick = () => {
    addToCart(product.id, currentQty);
    closeQuickView();
  };

  modalOverlay.classList.add('open');
}

function closeQuickView() {
  const modalOverlay = document.getElementById('quickViewModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
  }
}

// ==========================================================================
// 7. PRODUCT GRID RENDERING & FILTERING
// ==========================================================================
function renderProductCard(product) {
  return `
    <div class="product-card" data-category="${product.category}" data-id="${product.id}" data-price="${product.price}">
      <div class="product-media">
        <span class="badge badge-mocha product-tag">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <button class="quick-view-btn" onclick="openQuickView('${product.id}')">Olfactory Profile</button>
      </div>
      <div class="product-body">
        <div class="product-category-row">
          <span class="product-category">${product.categoryName}</span>
          <span class="product-burntime">${product.burnTime}</span>
        </div>
        <h3 class="product-title"><a href="javascript:void(0)" onclick="openQuickView('${product.id}')">${product.name}</a></h3>
        <p class="product-scent-summary">${product.scents}</p>
        
        <div class="product-notes-pills">
          <span class="note-pill">${product.topNotes.split(',')[0]}</span>
          <span class="note-pill">${product.heartNotes.split(',')[0]}</span>
          <span class="note-pill">${product.baseNotes.split(',')[0]}</span>
        </div>

        <div class="product-footer">
          <div class="product-price-row">
            <span class="product-price">${formatPKR(product.price)}</span>
            <span class="product-weight">${product.weight}</span>
          </div>
          <div class="product-actions-row">
            <div class="quantity-control">
              <button class="qty-btn" onclick="changeCardQty('${product.id}', -1)">−</button>
              <input type="text" class="qty-input" id="qty-${product.id}" value="1" readonly>
              <button class="qty-btn" onclick="changeCardQty('${product.id}', 1)">+</button>
            </div>
            <button class="btn btn-primary btn-sm" onclick="addCardToCart('${product.id}')">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function changeCardQty(productId, delta) {
  const input = document.getElementById(`qty-${productId}`);
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
}

function addCardToCart(productId) {
  const input = document.getElementById(`qty-${productId}`);
  const qty = input ? parseInt(input.value, 10) || 1 : 1;
  addToCart(productId, qty);
  if (input) input.value = 1;
}

function initProductsCatalog() {
  const container = document.getElementById('catalogProductsGrid');
  if (!container) return;

  const searchInput = document.getElementById('catalogSearch');
  const sortSelect = document.getElementById('catalogSort');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCountDisplay = document.getElementById('catalogCount');

  let activeCategory = 'all';
  let searchTerm = '';
  let sortBy = 'featured';

  function filterAndSortProducts() {
    let filtered = PRODUCTS.filter(product => {
      const matchCat = activeCategory === 'all' || product.category === activeCategory;
      const matchSearch = searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.scents.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm) ||
        product.topNotes.toLowerCase().includes(searchTerm) ||
        product.heartNotes.toLowerCase().includes(searchTerm) ||
        product.baseNotes.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'burn-time') {
      filtered.sort((a, b) => parseInt(b.burnTime) - parseInt(a.burnTime));
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="margin-bottom: 1rem; color: var(--color-charcoal-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 style="margin-bottom: 0.5rem;">No Scented Matches Found</h3>
          <p style="color: var(--color-charcoal-muted); margin-bottom: 1.5rem;">We could not find any candles matching "${searchTerm}". Try another fragrance keyword.</p>
          <button class="btn btn-secondary btn-sm" onclick="resetCatalogFilters()">Reset All Filters</button>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(renderProductCard).join('');
    }

    if (productCountDisplay) {
      productCountDisplay.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} artisan creations`;
    }
  }

  window.resetCatalogFilters = () => {
    activeCategory = 'all';
    searchTerm = '';
    sortBy = 'featured';
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
    filterAndSortProducts();
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      filterAndSortProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterAndSortProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      filterAndSortProducts();
    });
  }

  filterAndSortProducts();
}

function initFeaturedProducts() {
  const container = document.getElementById('featuredProductsGrid');
  if (!container) return;
  const featured = PRODUCTS.slice(0, 4);
  container.innerHTML = featured.map(renderProductCard).join('');
}

// ==========================================================================
// 8. ORDER PAGE & CHECKOUT LOGIC (order.html)
// ==========================================================================
function renderOrderReview() {
  const container = document.getElementById('orderReviewContainer');
  const priceSubtotal = document.getElementById('summarySubtotal');
  const priceShipping = document.getElementById('summaryShipping');
  const priceDiscount = document.getElementById('summaryDiscount');
  const discountRow = document.getElementById('summaryDiscountRow');
  const priceGrandTotal = document.getElementById('summaryGrandTotal');
  const submitBtn = document.getElementById('orderSubmitBtn');

  if (!container) return;

  const { cart, subtotal, discount, shippingCost, grandTotal } = getCartCalculations();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h4 class="empty-cart-title">Your Cart is Currently Empty</h4>
        <p class="empty-cart-desc">Before checking out, please select from our handcrafted scented candle collection.</p>
        <a href="products.html" class="btn btn-primary">Browse Candle Collection</a>
      </div>
    `;
    if (priceSubtotal) priceSubtotal.textContent = formatPKR(0);
    if (priceShipping) priceShipping.textContent = formatPKR(0);
    if (discountRow) discountRow.style.display = 'none';
    if (priceGrandTotal) priceGrandTotal.textContent = formatPKR(0);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Cart is Empty';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = `Confirm & Place Order • ${formatPKR(grandTotal)}`;
  }

  container.innerHTML = `
    <div class="cart-items-review">
      ${cart.map(item => `
        <div class="cart-review-item">
          <img src="${item.image}" alt="${item.name}" class="cart-review-thumb">
          <div class="cart-review-details">
            <h4>${item.name}</h4>
            <p class="cart-review-scent">${item.scents}</p>
            <div class="quantity-control">
              <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">−</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div>
            <div class="cart-review-subtotal">${formatPKR(item.price * item.quantity)}</div>
            <button class="cart-remove-btn" onclick="removeCartItem('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  if (priceSubtotal) priceSubtotal.textContent = formatPKR(subtotal);
  if (priceShipping) {
    priceShipping.textContent = shippingCost === 0 ? 'Complimentary' : formatPKR(shippingCost);
  }

  if (discountRow && priceDiscount) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      priceDiscount.textContent = `-${formatPKR(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (priceGrandTotal) priceGrandTotal.textContent = formatPKR(grandTotal);
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.option-select-card').forEach(c => c.classList.remove('active'));
      const parentCard = radio.closest('.option-select-card');
      if (parentCard) parentCard.classList.add('active');
      renderOrderReview();
    });
  });

  const promoInput = document.getElementById('promoCodeInput');
  const promoBtn = document.getElementById('promoApplyBtn');
  const promoStatus = document.getElementById('promoStatusMsg');

  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'AURA10') {
        localStorage.setItem(PROMO_STORAGE_KEY, 'AURA10');
        if (promoStatus) {
          promoStatus.textContent = '10% Club Atelier discount applied';
          promoStatus.className = 'coupon-status-msg success';
        }
        showToast('Promo code AURA10 applied successfully');
        renderOrderReview();
      } else if (code === 'MAISONFREE') {
        localStorage.setItem(PROMO_STORAGE_KEY, 'MAISONFREE');
        if (promoStatus) {
          promoStatus.textContent = 'Complimentary delivery unlocked';
          promoStatus.className = 'coupon-status-msg success';
        }
        showToast('Complimentary delivery code applied');
        renderOrderReview();
      } else {
        if (promoStatus) {
          promoStatus.textContent = 'Invalid promo code. Try "AURA10" for 10% off.';
          promoStatus.className = 'coupon-status-msg error';
        }
        showToast('Invalid promo code', 'error');
      }
    });
  }

  // Form Submission & Validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const { cart, grandTotal } = getCartCalculations();
    if (cart.length === 0) {
      showToast('Your cart is empty. Please add candles before ordering.', 'error');
      return;
    }

    const fullName = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!fullName) {
      showToast('Please enter your full customer name.', 'error');
      document.getElementById('custName').focus();
      return;
    }

    if (!phone) {
      showToast('Please enter your contact phone number.', 'error');
      document.getElementById('custPhone').focus();
      return;
    }

    if (!address) {
      showToast('Please enter your complete delivery address.', 'error');
      document.getElementById('custAddress').focus();
      return;
    }

    // Generate unique Order Number
    const orderNumber = 'MA-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const confirmModal = document.getElementById('orderConfirmationModal');
    const confirmBody = document.getElementById('confirmationContent');

    if (confirmModal && confirmBody) {
      confirmBody.innerHTML = `
        <div class="confirmation-card">
          <div class="confirm-icon-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="eyebrow"><span class="eyebrow-pip"></span> Order Confirmed</span>
          <h2 style="font-size: 2.1rem; margin-bottom: 0.5rem;">Thank You For Your Order</h2>
          <p style="color: var(--color-charcoal-muted); font-size: 0.92rem;">
            Your artisanal candle reservation has been received and scheduled for dispatch.
          </p>
          <div class="order-ref-badge">ORDER REF: ${orderNumber}</div>

          <div class="confirmation-details-box">
            <h5>Customer &amp; Delivery Summary</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <strong>Client:</strong> ${fullName}<br>
                <strong>Phone:</strong> ${phone}<br>
                <strong>Date:</strong> ${orderDate}
              </div>
              <div>
                <strong>Delivery Address:</strong><br>
                ${address}
              </div>
            </div>

            <h5 style="margin-top: 1rem;">Items Reserved</h5>
            <ul style="list-style: none; padding: 0; margin-bottom: 1rem;">
              ${cart.map(item => `
                <li style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px dashed var(--color-border);">
                  <span>${item.quantity} × ${item.name} (${item.weight})</span>
                  <strong>${formatPKR(item.price * item.quantity)}</strong>
                </li>
              `).join('')}
            </ul>

            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; color: var(--color-charcoal); border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
              <span>Grand Total</span>
              <span style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-mocha);">${formatPKR(grandTotal)}</span>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="window.print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print Receipt
            </button>
            <a href="products.html" class="btn btn-primary" onclick="clearCartAndRedirect()">
              Continue Shopping
            </a>
          </div>
        </div>
      `;

      confirmModal.classList.add('open');
      clearCart();
    }
  });
}

function clearCartAndRedirect() {
  clearCart();
  window.location.href = 'products.html';
}

function closeConfirmationModal() {
  const modal = document.getElementById('orderConfirmationModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// ==========================================================================
// 9. NEWSLETTER SUBSCRIPTION
// ==========================================================================
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast('Welcome to Club Atelier. Use code AURA10 for 10% off.');
        localStorage.setItem(PROMO_STORAGE_KEY, 'AURA10');
        emailInput.value = '';
      }
    });
  });
}

// ==========================================================================
// 10. DOM INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initCartDrawer();
  initMobileNav();
  initNewsletter();

  if (document.getElementById('catalogProductsGrid')) {
    initProductsCatalog();
  }

  if (document.getElementById('featuredProductsGrid')) {
    initFeaturedProducts();
  }

  if (document.getElementById('orderReviewContainer')) {
    renderOrderReview();
    initCheckoutForm();
  }
});
